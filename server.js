const dotenv = require("dotenv");
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

app.listen(port, () => console.log(`Server is listenning on port ${port}`));
