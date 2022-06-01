const express = require("express");
const userRoutes = require("./routes/userRoutes");
const errorController = require("./controllers/errorController.js");
const cookieParser = require("cookie-parser");
const ErrorHandler = require("./providers/ErrorHandler");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  console.log("get /");
  res.status(200).json({
    status: "success",
    message: "The password has been reset successfully",
  });
});
app.use("/api/v1/users", userRoutes);

app.all("*", function (req, res, next) {
  next(new ErrorHandler(404, "no such route found on this api "));
});

app.use(errorController);

module.exports = app;
