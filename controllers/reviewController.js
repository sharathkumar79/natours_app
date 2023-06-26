const Review = require('../models/reviewmodel');
const catchAsync = require('./../utils/catchAsync');
const { deleteOne, updateOne, createOne, read, getOne } = require('./handlerFactory');




/////////////geting all reviews on one tours or all tours ///////////
exports.filterBytourId = (req, res, next) => {
  if (req.params.tourId) req.query.tour = req.params.tourId;
  console.log(req.query);
  next();
};
exports.totalReviews = read(Review);



// ////////////////////////////////////////creating review //////////////////
///////to set user and tour ids 
exports.setUserTourId = (req, res, next) => {
  req.body.user = req.user.id;
  req.body.tour = req.params.tourId;
  next();
};
// then review creation ///
exports.createReview = createOne(Review);



exports.deleteReview = deleteOne(Review);
exports.updateReview = updateOne(Review);
exports.getoneReview = getOne(Review);
