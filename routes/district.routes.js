const router = require("express").Router();
const {
  addDistrict,
  getAllDistricts,
  getDistrict,
  updateDistrict,
  deleteDistrict,
} = require("../controllers/district.controller");

const adminGuard = require("../middlewares/guards/admin-jwt.guard")

router.post("/", adminGuard, addDistrict);
router.get("/", getAllDistricts);
router.get("/:id", getDistrict);
router.patch("/:id", adminGuard, updateDistrict);
router.delete("/:id", adminGuard, deleteDistrict);

module.exports = router;
