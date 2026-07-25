require("dotenv").config({ path: "../../.env" });
const connectDB = require("../config/db");
const User = require("../models/User");

const updateUsers = async () => {
  try {
    await connectDB(); 

    const result = await User.updateMany({}, { $set: { isActive: true } }); // Update all users
    console.log(`✅ Updated ${result.modifiedCount} users`);

    process.exit(); 
  } catch (err) {
    console.error("❌ Error updating users:", err);
    process.exit(1);
  }
};

updateUsers();