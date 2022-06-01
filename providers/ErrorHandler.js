module.exports = class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = String(statusCode).startsWith("4") ? "fail" : "error";
    this.isOperational = true;
  }
};
