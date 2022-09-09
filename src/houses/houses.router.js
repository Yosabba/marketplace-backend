const router = require("express").Router();
const controller = require("./houses.controller");
const notFound = require("../errors/NotAllowed");
const NotAllowed = require("../errors/NotAllowed");

router.route("/").get(controller.list).post(controller.create);

router
  .route("/:houseId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.destroy);

module.exports = router;
