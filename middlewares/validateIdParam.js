module.exports = (req, res, next) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).send({
      message: "ID faqat raqam bo'lishi kerak",
    });
  }

  next();
};
