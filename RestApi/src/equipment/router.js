const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/", controller.getEquipments);
router.post("/",controller.addEquipments);
router.get("/:id",controller.getEquipmentById);
router.put("/:id",controller.updateEquipments);
router.delete("/:id",controller.deleteEquipments);




module.exports = router;

