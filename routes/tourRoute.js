const express = require('express');
const tourRouter = express.Router();
const tourController = require('./../controller/tourController');
const authController = require('./../controller/authController');
const reviewRouter = require('./reviewRoute');

//SUB Router
tourRouter.use('/:tourId/reviews',reviewRouter);

tourRouter
.route('/monthly-plan/:year')
.get(authController.protect,authController.restrictTo('admin','lead-guide','guide'),tourController.getMonthlyPlan);

tourRouter
.route('/tour-stats')
.get(tourController.getTourStat);

tourRouter
.route('/get-5-best')
.get(tourController.top5tour,tourController.getAllTours);

tourRouter
.route('/')
.get(tourController.getAllTours)
.post(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.createTour);

tourRouter
.route('/:id')
.get(tourController.getTour)
.patch(authController.protect,
    authController.restrictTo('admin','lead-guide'),
    tourController.uploadImages,
    tourController.resizeTourImages,
    tourController.updateTour)
.delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour);

tourRouter
.route('/tours-within/:distance/center/:latlng/unit/:unit')
.get(tourController.getTourWithin);

tourRouter
.route('/distances/:latlng/unit,:unit')
.get(tourController.getDistances);

module.exports = tourRouter;
