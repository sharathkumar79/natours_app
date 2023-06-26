const CatchAsync = require('../utils/catchAsync');
const User = require('../models/usermodel');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');
const Tour = require('../models/tourmodel');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const Email = require('../utils/email');

const sendToken = (user, res, status) => {
  const token = jwt.sign({ id: user._id }, process.env.jwt_secret, {
    expiresIn: '12d',
  });

  res.cookie('jwt', token, {
    maxAge: 12 * 24 * 60 * 60 * 1000,
    // expiers: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    // secure: true,
    httpOnly: true,
  });

  res.status(status).json({
    status: 'success',
    token,
  });
};

exports.signUp = CatchAsync(async (req, res) => {
  const user = await User.create(req.body);
  await new Email(
    user,
    `${req.protocol}://${req.get('host')}/me`
  ).sendWelcome();
  sendToken(user, res, 200);
});

exports.login = CatchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  //checking does enterd email and password
  if (!email || !password) {
    return next(new AppError('please enter email and password', 400));
  }

  //checking is there any user for provided email
  const user = await User.findOne({ email: email }).select('+password');
  if (!user)
    return next(
      new AppError(
        'user not found please signup first or please check ur email again',
        400
      )
    );

  //checking password is correct or not
  const match = await user.checkPassword(password);
  if (!match) return next(new AppError('invalid password', 400));
  console.log('login fn');

  //genarating token sending it to the user

  sendToken(user, res, 200);
});

exports.logout = CatchAsync(async (req, res, next) => {
  res.cookie('jwt', 'logging out', {
    maxAge: 1000,
    // expiers: new Date(Number(Date.now()) + 1),
    // secure: true,
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
});

exports.protect = CatchAsync(async (req, res, next) => {
  //checking req header
  let token;
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else {
      return next(new AppError('U r not logged in', 401));
    }
  } else token = req.headers.authorization.split(' ')[1];

  //verifying token
  const payload = jwt.verify(token, process.env.jwt_secret);

  //checking user in data base
  const freshUser = await User.findById(payload.id);
  if (!freshUser) {
    return next(new AppError('no user found', 401));
  }

  //checking user changed the password after token has been isuied;
  if (freshUser.changedPasswordAfter(payload.iat)) {
    return next(new AppError('password has been changed login again', 401));
  }
  req.user = freshUser;

  // console.log(req.user);
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles))
      return next(new AppError('u can not perform this action', 403));
    next();
  };
};

exports.forgetPassword = CatchAsync(async (req, res, next) => {
  //finding User
  const user = await User.findOne(req.body);
  if (!user) {
    return next('check u r email no user found', 400);
  }

  //generating token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //sending token via email.

  const resetURl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/resetPassword/${resetToken}`;
  const message = `<p>forgot u r password enter u r new password in the following url</p> <p style="colour:red"><a>${resetURl}</a></p>`;

  try {
    await new Email(user, resetURl).sendResetPasswordLink();
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save({ validateBeforeSave: false });
    return next(new AppError('problem sending email try again later', 500));
  }

  res.status(200).json({
    status: 'success',
    message: 'mail sent successfully',
  });
});

exports.resetPassword = CatchAsync(async (req, res, next) => {
  //finding the user based on token
  const hashedtoken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({ passwordResetToken: hashedtoken }).select(
    '+password'
  );

  if (!user) return next(new AppError('invalid token no user found', 401));

  //checking expiry of token
  if (Date.now() > user.passwordResetTokenExpires)
    return next(new AppError('token has expired', 401));

  console.log(user);

  //updating the new password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  //updating the confirm password
  await user.save();

  sendToken(user, res, 200);
});

exports.updatePassword = CatchAsync(async (req, res, next) => {
  //checking all parameters are present
  if (!req.body.newPassword || !req.body.confirmPassword) {
    return next(
      new AppError('newpassword or confirm password feilds are missings')
    );
  }
  const user = await User.findById(req.user._id).select('+password');
  // matching currentpassword
  const match = await user.checkPassword(req.body.currentPassword);
  if (!match) {
    return next(
      new AppError('plese check ur current password once again', 400)
    );
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.confirmPassword;
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.jwt_secret, {
    expiresIn: '12d',
  });

  res.status(200).json({
    status: 'success',
    token,
  });
});
