const express = require("express");
const userRoutes = require("./routes/userRoutes");

const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  console.log("get /");
});
app.use("/api/v1/users", userRoutes);

module.exports = app;
