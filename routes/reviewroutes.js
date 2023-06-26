const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const Router = express.Router({ mergeParams: true });

Router.route('/')
  .get(
    authController.protect,
    reviewController.filterBytourId,
    reviewController.totalReviews
  )
  .post(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    reviewController.setUserTourId,
    reviewController.createReview
  );

Router.route('/:id')
  .delete(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .get(reviewController.getoneReview);

module.exports = Router;
