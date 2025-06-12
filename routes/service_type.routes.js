const router = require("express").Router();
const {
  createServiceType,
  getAllServiceTypes,
  getServiceType,
  updateServiceType,
  deleteServiceType,
} = require("../controllers/service_type.controller");

const adminGuard = require("../middlewares/guards/admin-jwt.guard");

router.post("/", adminGuard, createServiceType);
router.get("/", getAllServiceTypes);
router.get("/:id", getServiceType);
router.patch("/:id", adminGuard, updateServiceType);
router.delete("/:id", adminGuard, deleteServiceType);

module.exports = router;
