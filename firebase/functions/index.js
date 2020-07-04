const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./Routes/authRoutes");
const blockchainRoutes = require("./Routes/blockchainRoutes");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());
app.use(cors());

//-> Routes and Handlers
app.use("/api/auth", authRoutes);
app.use("/api/blockchain", blockchainRoutes);
app.use("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Not Found",
  });
});

app.use = (err, req, res, next) => {
  return res.status(400).json({
    status: "fail",
    message: err.message,
  });
};

exports.app = functions.https.onRequest(app);
