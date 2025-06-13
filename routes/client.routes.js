const router = require("express").Router();
const {
  register,
  activateAccount,
  login,
  logout,
  refreshToken,
  getAllClients,
  getClient,
  updateClient,
  deleteClient,
  changePassword,
} = require("../controllers/client.controller");

const validateIdParam = require("../middlewares/validateIdParam");
const adminGuard = require("../middlewares/guards/admin-jwt.guard");
const clientGuard = require("../middlewares/guards/client-jwt.guard");
const clientSelfGuard = require("../middlewares/guards/client-self.guard");

// PUBLIC
router.post("/", register);
router.get("/activate/:token", activateAccount);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

// ADMIN ONLY
router.get("/admin", adminGuard, getAllClients);
router.get("/admin/:id", validateIdParam, adminGuard, getClient);
router.patch("/admin/:id", validateIdParam, adminGuard, updateClient);
router.delete("/admin/:id", validateIdParam, adminGuard, deleteClient);
router.patch(
  "/admin/:id/change-password",
  validateIdParam,
  adminGuard,
  changePassword
);

// CLIENT SELF
router.get("/:id", validateIdParam, clientGuard, clientSelfGuard, getClient);
router.patch(
  "/:id",
  validateIdParam,
  clientGuard,
  clientSelfGuard,
  updateClient
);
router.delete(
  "/:id",
  validateIdParam,
  clientGuard,
  clientSelfGuard,
  deleteClient
);
router.patch(
  "/:id/change-password",
  validateIdParam,
  clientGuard,
  clientSelfGuard,
  changePassword
);

module.exports = router;
