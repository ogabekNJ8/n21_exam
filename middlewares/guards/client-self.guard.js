const { sendErrorresponse } = require("../../helpers/send_error_response");

module.exports = (req, res, next) => {
  try {
    if (req.params.id !== req.client.id) {
      return res.status(403).send({
        message: "Faqat o'zingizning ma'lumotlaringizni ko'rish mumkin",
      });
    }
    next();
  } catch (error) {
    sendErrorresponse(error, res);
  }
};
