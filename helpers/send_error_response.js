const sendErrorResponse = (res, error, status = 500) => {
  res.status(status).send({ error: error.message });
};

module.exports = {
  sendErrorResponse,
};
