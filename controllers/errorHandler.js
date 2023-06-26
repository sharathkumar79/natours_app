const AppError = require('../utils/appError');

const mongooseCastError = (err) => {
  return new AppError(`chech ${err.path}: ${err.value}`, 400);
};

const duplicateKeyError = (err) => {
  return new AppError(`${err[0]} must be uniquie`, 400);
};

const validationError = (err) => {
  return new AppError(err.message, 400);
};

const JsonWebTokenError = () => new AppError('invalid token', 401);
const devError = (req, err, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    console.log(err);
    res.status(err.statusCode).render('error', {
      title: 'something is wrong',
      err,
    });
  }
};

const prodError = (err, res) => {
  if (err.isproduction) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'fail',
      message: 'internal server error',
    });
  }
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV == 'development') {
    devError(req, err, res);
  } else {
    let error = { ...err };
    if (err.name == 'CastError') error = mongooseCastError(error);
    if (err.code == 11000) error = duplicateKeyError(error);
    if (err.name == 'ValidationError') error = validationError(err);
    if (err.name == 'jsonWebTokenError') error = JsonWebTokenError();
    prodError(req, error, res);
  }
  next();
};
module.exports = errorHandler;
