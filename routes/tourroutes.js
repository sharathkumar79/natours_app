const express = require('express');
const authController = require('../controllers/authController');
const tourcontroller = require('./../controllers/tourcontroller');
const reviewRouter = require('./reviewroutes');

const Router = express.Router();

Router.use('/:tourId/reviews', reviewRouter);

Router.route('/top-5-cheap/').get(
  tourcontroller.topFiveCheapTour,
  tourcontroller.getAllTours
);

Router.route('/get-month-plan/:year').get(tourcontroller.getMonthlyPlan);
Router.route('/tour-stats').get(tourcontroller.getStats);

Router.route('/tours-within/:distance/center/:latlng/units/:unit').get(
  tourcontroller.toursWithIn
);
Router.route('/distance-from-location/:latlng').get(
  tourcontroller.distanceFromLocation
);

Router.route('/')
  .get(authController.protect, tourcontroller.getAllTours)
  .post(tourcontroller.addtour);
Router.route('/:id')
  .get(tourcontroller.getTour)
  .patch(tourcontroller.updatetour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourcontroller.deletetour
  );

// Router.route('/:tourId/reviews').post(
//   authController.protect,
//   authController.restrictTo('user'),
//   reviewController.createReview
// );
module.exports = Router;
