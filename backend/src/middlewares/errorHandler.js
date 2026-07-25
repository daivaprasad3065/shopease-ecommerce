// backend/src/middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  // Suppress ObjectId cast errors logging during tests
  if (process.env.NODE_ENV === "test" && err.message.includes("Cast to ObjectId failed")) {
  
  } else {
    console.error("Error: ", err.message);
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
