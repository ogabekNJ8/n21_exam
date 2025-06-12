const router = require("express").Router();
const {
  register,
  activateAccount,
  login,
  logout,
  refreshToken,
  getAllOwners,
  getOwner,
  updateOwner,
  deleteOwner,
  changePassword,
} = require("../controllers/owner.controller");

const validateIdParam = require("../middlewares/validateIdParam");
const adminGuard = require("../middlewares/guards/admin-jwt.guard");
const ownerSelfGuard = require("../middlewares/guards/owner-self.guard")
const ownerGuard = require("../middlewares/guards/owner-jwt.guard")

router.post("/register", register);
router.get("/activate/:token", activateAccount);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

router.get("/admin", adminGuard, getAllOwners);
router.get("/admin/:id", validateIdParam, adminGuard, getOwner);
router.patch("/admin/:id", validateIdParam, adminGuard, updateOwner);
router.delete("/admin/:id", validateIdParam, adminGuard, deleteOwner);
router.patch("/admin/:id/change-password", adminGuard, changePassword);

router.get("/:id", validateIdParam, ownerGuard, ownerSelfGuard, getOwner);
router.patch("/:id", validateIdParam, ownerGuard, ownerSelfGuard, updateOwner);
router.delete("/:id", validateIdParam, ownerGuard, ownerSelfGuard, deleteOwner);
router.patch("/:id/change-password", ownerGuard, ownerSelfGuard, changePassword);


module.exports = router;
