const { sendErrorResponse } = require("../../helpers/send_error_response");

module.exports = (req, res, next) => {
  try {
    const paramId = String(req.params.id);

    if (!req.owner || String(req.owner.id) !== paramId) {
      return res.status(403).send({
        message: "Faqat o'z profilingizga ruxsat bor",
      });
    }

    next();
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};
