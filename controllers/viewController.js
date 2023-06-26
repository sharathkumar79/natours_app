const CatchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourmodel');
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');
const AppError = require('../utils/appError');

exports.getOverview = CatchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
    user: req.user,
  });
});

exports.getTour = CatchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');
  if (!tour) return next(new AppError('no tour with that id', 400));
  console.log(tour);
  res.status(200).render('tour', {
    title: tour.name,
    tour,
    user: req.user,
  });
});

exports.loginPage = CatchAsync(async (req, res, next) => {
  res.status(200).render('login', { title: 'Login into Your account' });
});

exports.userlogged = CatchAsync(async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return next();
    //verifying tok
    const payload = jwt.verify(token, process.env.jwt_secret);

    //checking user in data base
    const freshUser = await User.findById(payload.id);
    if (!freshUser) return next();

    //checking user changed the password after token has been isuied;
    if (freshUser.changedPasswordAfter(payload.iat)) return next();

    req.user = freshUser;
    console.log(freshUser);
    next();
  } catch (err) {
    next();
  }
  // console.log(req.user);
});

exports.account = CatchAsync(async (req, res, next) => {
  res
    .status(200)
    .render('useraccount', { title: req.user.name, user: req.user });
});
