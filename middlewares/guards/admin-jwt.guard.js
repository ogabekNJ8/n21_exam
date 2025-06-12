const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Token berilmagan" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, config.get("adminAccess_key"));

    req.admin = {
      id: payload.id,
      role: payload.role,
    };
    next();
  } catch (error) {
    res.status(401).send({ message: "Token noto'g'ri yoki muddati o'tgan" });
  }
};
