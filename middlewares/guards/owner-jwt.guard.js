const jwt = require("jsonwebtoken");
const config = require("config");
const { sendErrorResponse } = require("../../helpers/send_error_response");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "Token topilmadi" });
    }

    const payload = jwt.verify(token, config.get("ownerAccess_key"));
    req.owner = payload;
    next();
  } catch (error) {
    sendErrorResponse(res, error, 401);
  }
};
