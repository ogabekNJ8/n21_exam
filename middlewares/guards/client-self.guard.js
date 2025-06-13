const { sendErrorResponse } = require("../../helpers/send_error_response");

module.exports = (req, res, next) => {
  try {
    if (Number(req.params.id) !== req.client.id) {
      return res.status(403).send({
        message: "Faqat o'zingizning ma'lumotlaringizni ko'rish mumkin",
      });
    }
    next();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
