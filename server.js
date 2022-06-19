const dotenv = require("dotenv");
process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});
dotenv.config({ path: `${__dirname}/.env` });
const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT || 3000;

const password = process.env.DB_PASSWORD;
let DB = process.env.DB;
DB = DB.replace("<password>", password);

mongoose
  .connect(DB, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log(err));

const server = app.listen(port, process.env.IP, () =>
  console.log(`Server is listenning on port ${port}`)
);

process.on("unhandledRejection", function (err) {
  console.log(err.name, err.message);
  console.log("unhandled rejection solved");
  server.close(() => {
    process.exit(1);
  });
});
