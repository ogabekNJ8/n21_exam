const router = require("express").Router();
const {
  createWeddingService,
  getAllWeddingServices,
  getWeddingService,
  updateWeddingService,
  deleteWeddingService,
} = require("../controllers/wedding_service.controller");

const ownerGuard = require("../middlewares/guards/owner-jwt.guard");
const adminGuard = require("../middlewares/guards/admin-jwt.guard");
const validateIdParam = require("../middlewares/validateIdParam");

router.post("/", ownerGuard, createWeddingService);
router.get("/", getAllWeddingServices); // umumiy list (public)

router.get("/:id", validateIdParam, getWeddingService);
router.patch("/:id", validateIdParam, ownerGuard, updateWeddingService);
router.delete("/:id", validateIdParam, ownerGuard, deleteWeddingService);

router.get("/admin/", adminGuard, getAllWeddingServices);
router.get("/admin/:id", validateIdParam, adminGuard, getWeddingService);
router.patch("/admin/:id", validateIdParam, adminGuard, updateWeddingService);
router.delete("/admin/:id", validateIdParam, adminGuard, deleteWeddingService);

module.exports = router;
