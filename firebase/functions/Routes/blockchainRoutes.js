const express = require("express");
const router = new express.Router();
const checkpoint = require("../Controllers/authControllers").check;

const blockchainController = require("../Controllers/blockchainController");

router.post("/addblock", checkpoint, blockchainController.addBlock);
router.post("/transaction", checkpoint, blockchainController.transation);

module.exports = router;
