const router = require("express").Router();
const {
  createContract,
  getAllContracts,
  getContract,
  updateContract,
  deleteContract,
  updateContractStatus,
  getContractsByDateRange,
  getClientsByDateRange,
  getCancelledClientsByDateRange,
  getTopOwnersByServiceName,
  getClientPayments,
} = require("../controllers/contract.controller");

const adminGuard = require("../middlewares/guards/admin-jwt.guard");
const clientGuard = require("../middlewares/guards/client-jwt.guard");
const clientSelfGuard = require("../middlewares/guards/client-self.guard");

router.get("/admin", adminGuard, getAllContracts);
router.get("/admin/:id", adminGuard, getContract);
router.patch("/admin/:id", adminGuard, updateContract);
router.delete("/admin/:id", adminGuard, deleteContract);
router.patch("/admin/:id/status", adminGuard, updateContractStatus);

router.get("/admin/filter/by-date", adminGuard, getContractsByDateRange);
router.get("/admin/filter/clients-used", adminGuard, getClientsByDateRange);
router.get(
  "/admin/filter/cancelled",
  adminGuard,
  getCancelledClientsByDateRange
);
router.get("/admin/filter/top-owners", adminGuard, getTopOwnersByServiceName);
router.get("/admin/filter/client-payments", adminGuard, getClientPayments);

router.post(
  "/",
  clientGuard,
  createContract
);
router.get("/:id", clientGuard, clientSelfGuard, getContract);
router.patch(
  "/:id",
  clientGuard,
  clientSelfGuard,
  updateContract
);
router.delete(
  "/:id",
  clientGuard,
  clientSelfGuard,
  deleteContract
);

module.exports = router;
