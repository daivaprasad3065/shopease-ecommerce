const Admin = require("../models/Admin");
const User = require("../models/User"); 
const Cart = require("../models/Cart")
const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../middlewares/responseHandler");

// Registering new Admin
exports.registerAdmin = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return errorResponse(res, "Admin already exists", 400);
    }

    const admin = new Admin({ name, email, password, role: "admin" });
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );

    return successResponse(res, "Admin registered successfully", { token, admin: { id: admin._id, name: admin.name, email: admin.email } }, 201);
  } catch (err) {
    next(err);
  }
};

// Admin Login function
exports.loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return errorResponse(res, "Invalid email or password", 400);
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return errorResponse(res, "Invalid email or password", 400);
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );

    return successResponse(res, "Login successful", {
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    next(err);
  }
};

// Dashboard for Admin
exports.getAdminDashboard = (req, res, next) => {
  return successResponse(res, "Welcome to the admin dashboard", {
    adminId: req.user.id,
  });
};

// Getting All Users details with Pagination, Search, and Filtering 
exports.getAllUsers = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, search = "", filter = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};
    const mongoose = require("mongoose");

    // Search by name, email, or user ID
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [{ name: searchRegex }, { email: searchRegex }]; // note: if the name has space request can't accept space. so to understand the space we have to use "%20" this code recognises the space. for example, if the name is "Test User" then the code should be -> users?search=Test%20User. if the name is "TestUser" then we can normally request it like -> users?search=TestUser

      if (mongoose.Types.ObjectId.isValid(search)) {
        query.$or.push({ _id: search });
      }
    }

    // Filtering (Active/Inactive)
    if (filter === "active") query.isActive = true;
    if (filter === "inactive") query.isActive = false;

    // Fetch users with pagination
    const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);

    return successResponse(res, "Users retrieved successfully", {
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (err) {
    next(err);
  }
};

// Getting Single User by their ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }
    return successResponse(res, "User retrieved successfully", user);
  } catch (err) {
    next(err);
  }
};

// function to modify the User Details
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;

    if (role && req.user.role !== "admin") {
      return errorResponse(res, "Only admins can assign roles", 403);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    );

    if (!user) return errorResponse(res, "User not found", 404);

    return successResponse(res, "User is updated successfully", user);
  } catch (err) {
    next(err);
  }
};

// Toggle User Active/Inactive Status
exports.UserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    user.isActive = !user.isActive;
    await user.save();

    return successResponse(
      res,
      `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      user
    );
  } catch (err) {
    next(err);
  }
};

// Deleting User
exports.deleteUser = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return errorResponse(res, "Access denied: Only admins can delete users", 403);
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    await Cart.deleteOne({ userId: req.params.id });

    await User.findByIdAndDelete(req.params.id);

    return successResponse(res, "User and their cart deleted successfully");
  } catch (err) {
    next(err);
  }
};

// Deleting Users in Bulk
exports.bulkDeleteUsers = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(res, "Access denied. Admins only.", 403);
    }

    const { userIds } = req.body; 

    if (!userIds || userIds.length === 0) {
      return errorResponse(res, "No user IDs provided", 400);
    }

    const result = await User.deleteMany({ _id: { $in: userIds } });

    return successResponse(res, `${result.deletedCount} users deleted successfully`);
  } catch (err) {
    next(err);
  }
};

// Blocking User
exports.blockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return errorResponse(res, "User not found", 404);

    user.isBlocked = true;
    await user.save();

    return successResponse(res, `User ${user.email} has been blocked.`);
  } catch (err) {
    next(err);
  }
};

// Unblocking User
exports.unblockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return errorResponse(res, "User not found", 404);

    user.isBlocked = false;
    await user.save();

    return successResponse(res, `User ${user.email} has been unblocked.`);
  } catch (err) {
    next(err);
  }
};

// Blocking Users in bulk
exports.bulkBlockUsers = async (req, res, next) => {
  try {
    const { userIds } = req.body; 

    if (!userIds || userIds.length === 0) {
      return errorResponse(res, "No user IDs provided", 400);
    }

    const result = await User.updateMany({ _id: { $in: userIds } }, { isBlocked: true });

    return successResponse(res, `${result.modifiedCount} users blocked successfully`);
  } catch (err) {
    next(err);
  }
};

// Unblocking Users in bulk
exports.bulkUnblockUsers = async (req, res, next) => {
  try {
    const { userIds } = req.body; 

    if (!userIds || userIds.length === 0) {
      return errorResponse(res, "No user IDs provided", 400);
    }

    const result = await User.updateMany({ _id: { $in: userIds } }, { isBlocked: false });

    return successResponse(res, `${result.modifiedCount} users unblocked successfully`);
  } catch (err) {
    next(err);
  }
};

// Getting all Blocked Users List
exports.getBlockedUsers = async (req, res, next) => {
  try {
    const blockedUsers = await User.find({ isBlocked: true }).select("name email role createdAt");

    if (blockedUsers.length === 0) {
      return successResponse(res, "Sorry!! No blocked users found.", []);
    }

    return successResponse(res, "Blocked users retrieved successfully", blockedUsers);
  } catch (err) {
    next(err);
  }
};

