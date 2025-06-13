const router = require("express").Router();
const {
  createPayment,
  getAllPayments,
  getPayment,
  updatePayment,
  deletePayment,
} = require("../controllers/payment.controller");

const adminGuard = require("../middlewares/guards/admin-jwt.guard");
const clientGuard = require("../middlewares/guards/client-jwt.guard");

router.post("/", clientGuard, createPayment);
router.get("/", adminGuard, getAllPayments);
router.get("/:id", adminGuard, getPayment);
router.patch("/:id", adminGuard, updatePayment);
router.delete("/:id", adminGuard, deletePayment);

module.exports = router;
