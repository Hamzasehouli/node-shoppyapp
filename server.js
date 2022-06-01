const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");

const port = process.env.port ?? 3000;

dotenv.config({ path: `${__dirname}/.env` });
const password = process.env.DB_PASSWORD;
let DB = process.env.DB;
DB = DB.replace("<password>", password);

mongoose
  .connect(DB, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log(err));

app.listen(port, () => console.log(`Server is listenning on port ${port}`));
