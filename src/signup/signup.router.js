const router = require("express").Router();
const controller = require("./signup.controller");

router.route("/").post(controller.signUp);

module.exports = router;
