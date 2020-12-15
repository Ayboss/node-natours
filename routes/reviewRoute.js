const express = require('express');
const reviewRouter =  express.Router({mergeParams:true});
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');

reviewRouter.use(authController.protect);

reviewRouter
.route('/')
.get(reviewController.getAllReview)
.post(authController.restrictTo('user'),
  reviewController.setTourUsersId,
  reviewController.createReview);

reviewRouter
.route('/:id')
.get(reviewController.getReview)
.patch(authController.restrictTo('user','admin'),reviewController.updateReview)
.delete(authController.restrictTo('user','admin'),reviewController.deleteReview)
module.exports = reviewRouter;
