const router = require("express").Router();
const loginController = require("./login.controller");

router.route("/").post(loginController.signUp);

module.exports = router;
