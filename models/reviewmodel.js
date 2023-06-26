const mongoose = require('mongoose');
const Tour = require('./tourmodel');
const CatchAsync = require('../utils/catchAsync');
const User = require('./usermodel');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'review musst contain some data'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: Date,
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'tour',
    required: [true, 'review must belong to tour'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'review must belong to user'],
  },
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre('save', function (next) {
  this.createdAt = Date.now();
  next();
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name photo' }).populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

reviewSchema.statics.calculateAvgRating = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: tourId,
        nratings: { $sum: 1 },
        avgratings: { $avg: '$rating' },
      },
    },
  ]);
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nratings,
    ratingsAverage: stats[0].avgratings,
  });
};

reviewSchema.post('save', function () {
  this.constructor.calculateAvgRating(this.tour);
});

// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   const m = { ...this.findOne() };
//   this.r = await m;
//   console.log(this.r);
// });

// reviewSchema.post(/^findOneAnd/, async function () {
//   await this.r.constructor.calculateAvgRating(this.r.tour);
// });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
