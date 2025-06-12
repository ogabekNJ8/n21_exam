const router = require("express").Router();
const {
  createAdmin,
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  changePassword,
  login,
  logout,
  refreshToken,
} = require("../controllers/admin.controller");

const adminGuard = require("../middlewares/guards/admin-jwt.guard")
const selfOrAdminGuard = require("../middlewares/guards/admin-self.guard");

router.post("/", adminGuard, createAdmin);
router.get("/", adminGuard, getAllAdmins);
router.get("/:id", adminGuard, getAdmin);
router.patch("/:id", adminGuard, updateAdmin);
router.delete("/:id", adminGuard, deleteAdmin);

router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

router.patch(
  "/:id/change-password",
  adminGuard,
  selfOrAdminGuard,
  changePassword
);

module.exports = router;
