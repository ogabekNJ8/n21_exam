const router = require("express").Router();
// const authMiddleware = require("../middlewares/auth.middleware");

const {
  addRegion,
  getAllRegions,
  getRegion,
  updateRegion,
  deleteRegion,
} = require("../controllers/region.controller");

const adminGuard = require("../middlewares/guards/admin-jwt.guard");

router.post("/", adminGuard, addRegion);
router.get("/", getAllRegions);
router.get("/:id", getRegion);
router.patch("/:id", adminGuard, updateRegion);
router.delete("/:id", adminGuard, deleteRegion);

module.exports = router;
