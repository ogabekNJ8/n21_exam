const { sendErrorResponse } = require("../../helpers/send_error_response");

module.exports = (req, res, next) => {
  try {
    if (!req.admin) {
      return res
        .status(401)
        .send({ message: "Token orqali avtorizatsiya zarur" });
    }

    const isAdmin = req.admin.role === "admin";
    const isSelf = req.params.id === String(req.admin.id);

    if (!isAdmin && !isSelf) {
      return res.status(403).send({
        message: "Faqat o'zingiz yoki admin huquqi bilan o'zgartirish mumkin",
      });
    }

    next();
  } catch (error) {
    sendErrorResponse(res, error, 403);
  }
};

