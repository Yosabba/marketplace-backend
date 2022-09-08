const errorHandler = (error, req, res, next) => {
  const { status = 500, message = "Critical Error" } = error;
  res.status(status).json({ error: message });
};

module.exports = errorHandler;
