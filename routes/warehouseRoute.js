const router = require("express").Router();
const warehouseController = require("../controllers/warehouseController");
router
  .route("/")
  .get(warehouseController.index)
  .post(warehouseController.addWarehouse);
router
  .route("/:id")
  .get(warehouseController.singleWarehouse)
  .put(warehouseController.updateWarehouse)
  .patch(warehouseController.patchWarehouse)
  .delete(warehouseController.deleteWarehouse);
/**
 * INSERT PATCH end point and route for /id!
 */
router.route("/:id/inventories").get(warehouseController.warehouseInventories);
module.exports = router;
