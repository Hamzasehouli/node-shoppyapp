module.exports = function (err, req, res, next) {
  const env = process.env.NODE_ENV.trim();

  if (env === "development") {
    if (err.isOperational) {
      if (!req.url.startsWith("/api/v1/")) {
        return res.status(err.statusCode).render("_error", {
          statusCode: err.statusCode,
          status: err.status,
          error: err.message,
        });
      }
      if (err.message === "11000") {
        console.log(err.message, "dddd");
        return res.status(err.statusCode).json({
          statusCode: 500,
          status: err.status,
          error: "The account with entered email is already used",
        });
      }
      return res.status(err.statusCode).json({
        statusCode: err.statusCode,
        status: err.status,
        error: err.message,
        stack: err.stack,
      });
    } else {
      return res.status(500).json({
        info: "is not an operational error",
        statusCode: err.statusCode,
        status: err.status,
        error: err.message,
        stack: err.stack,
      });
    }
  } else if (env === "production") {
    if (err.isOperational) {
      if (!req.url.startsWith("/api/v1/")) {
        return res.status(err.statusCode).render("_error", {
          statusCode: err.statusCode,
          status: err.status,
          error: err.message,
        });
      }
      return res.status(500).json({
        statusCode: err.statusCode,
        status: err.status,
        error: err.message,
      });
    } else {
      if (!req.url.startsWith("/api/v1/")) {
        return res.status(err.statusCode).render("_error", {
          statusCode: err.statusCode,
          status: err.status,
          error: "Something went wrong",
        });
      }
      if (err.code === 11000) {
        return res.status(500).json({
          statusCode: err.statusCode,
          status: err.status,
          error: "Something went wrong",
        });
      }
      return res.status(500).json({
        statusCode: err.statusCode,
        status: err.status,
        error: "something went wrong",
      });
    }
  }
};
