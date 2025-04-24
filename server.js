const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const router = require("./routes/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", router);

app.listen(3001, () => {
  console.log("Server is running on port 3000");
});
