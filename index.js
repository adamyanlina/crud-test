const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const keys = require("./config/keys");

const cors = require("cors");

mongoose.connect(keys.mongo_uri);

const app = express();

app.use(bodyParser.json());

app.use(cors());
app.use("/posts", require("./routes/post"));

const PORT = process.env.PORT || 5000;
app.listen(PORT);

module.exports = app;
