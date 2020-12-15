const Review = require('./../models/reviewModel');
const catchAsync = require('./../util/catchAsync');
const factoryController = require('./factoryController');



exports.setTourUsersId = (req,res,next)=>{
  if(!req.body.tour) req.body.tour = req.params.tourId;
  if(!req.body.user) req.body.user = req.user.id;
  next();
}

exports.getAllReview = factoryController.getAll(Review);

exports.getReview  = factoryController.getOne(Review);

exports.createReview = factoryController.createOne(Review);
//update review
exports.updateReview = factoryController.updateOne(Review);
//delete review
exports.deleteReview = factoryController.deleteOne(Review);
