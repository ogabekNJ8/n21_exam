const Contract = require("../models/contract.model");
const Payment = require("../models/payment.model");
const { sendErrorResponse } = require("../helpers/send_error_response");
const { Op } = require("sequelize");

const createPayment = async (req, res) => {
  try {
    const { contract_id, amount, payment_type, payment_date, comment } =
      req.body;

    const contract = await Contract.findOne({ where: { id: contract_id } });
    if (!contract) {
      return res.status(404).json({ message: "Kontrakt topilmadi" });
    }

    // Faqat o'zining contractiga payment qilishni tekshir
    if (req.client && contract.client_id !== req.client.id) {
      return res
        .status(403)
        .json({ message: "Ruxsat yo'q. Bu kontrakt sizga tegishli emas" });
    }

    if (contract.status !== "approved") {
      return res
        .status(400)
        .json({
          message: "Faqat tasdiqlangan kontraktlar uchun to'lov qilish mumkin",
        });
    }

    if (amount > contract.total_price) {
      return res
        .status(400)
        .json({
          message:
            "To'lov summasi kontrakt narxidan katta bo'lishi mumkin emas",
        });
    }

    const payment = await Payment.create({
      contract_id,
      amount,
      payment_type,
      payment_date,
      comment,
    });

    res.status(201).json({
      message: "To'lov muvaffaqiyatli yaratildi",
      data: payment,
    });
  } catch (error) {
    sendErrorResponse(res, error, 500);
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.json({ message: "To'lovlar ro'yxati", data: payments });
  } catch (error) {
    sendErrorResponse(res, error, 500);
  }
};

const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "To'lov topilmadi" });
    res.json({ message: "To'lov", data: payment });
  } catch (error) {
    sendErrorResponse(res, error, 500);
  }
};

const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "To'lov topilmadi" });

    const contract = await Contract.findByPk(payment.contract_id);
    if (!contract)
      return res.status(404).json({ message: "Bog'liq kontrakt topilmadi" });

    const { amount, payment_type, payment_date, comment } = req.body;

    if (amount && amount > contract.total_price) {
      return res
        .status(400)
        .json({
          message:
            "To'lov summasi kontrakt narxidan katta bo'lishi mumkin emas",
        });
    }

    await payment.update({
      amount: amount ?? payment.amount,
      payment_type: payment_type ?? payment.payment_type,
      payment_date: payment_date ?? payment.payment_date,
      comment: comment ?? payment.comment,
    });

    res.json({ message: "To'lov yangilandi", data: payment });
  } catch (error) {
    sendErrorResponse(res, error, 500);
  }
};

const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "To'lov topilmadi" });
    await payment.destroy();
    res.json({ message: "To'lov o'chirildi" });
  } catch (error) {
    sendErrorResponse(res, error, 500);
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPayment,
  updatePayment,
  deletePayment,
};
