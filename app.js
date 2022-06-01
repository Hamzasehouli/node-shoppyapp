const express = require("express");
const userRoutes = require("./routes/userRoutes");

const cookieParser = require("cookie-parser");

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

module.exports = app;
