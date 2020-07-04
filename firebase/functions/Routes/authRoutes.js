const express = require("express");
const authControllers = require("../Controllers/authControllers");

const router = new express.Router();
router.post("/signup", authControllers.signUp);
router.post("/check", authControllers.check);
// router.post("/test", authControllers.test);

module.exports = router;
