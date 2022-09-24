const router = require("express").Router();
const loginController = require("./login.controller");

router.route("/").post(loginController.login);

module.exports = router;
