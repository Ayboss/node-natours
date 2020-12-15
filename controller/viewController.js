const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Review = require('./../models/reviewModel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('../util/appError');

exports.getOverview = catchAsync(async (req,res,next)=>{
    //get all tours
    const tours = await Tour.find();
    res.status(200).render('overview',{
        title:'Exciting tours for adventurous people',
        tours
    })
}) 

exports.getTour = catchAsync(async (req,res,next)=>{
    //get data including reviews and guides
    const {tourSlug} = req.params
    const tour = await Tour.findOne({slug:tourSlug}).populate({
        path: 'reviews',
        fields: 'review rating user'
      });
    
    if(!tour){
        return next(new AppError(`there is no tour with the name ${tourSlug}`, 404))
    }
          
    res.status(200).render('tour',{
        title:tour.name,
        tour})
})

exports.login = (req,res)=>{
    res.status(200).render('login',{
        title:'Log into your account'
    })
}

exports.userAccount = catchAsync(async (req,res,next)=>{
    res.status(200).render('account',{
        title:'account settings'
    });
})

exports.updateUserData = catchAsync(async (req,res,next)=>{
    console.log(req.body);
    const {name, email} = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user.id,{name,email},{
        new: true,
        runValidators: true
    })
    console.log(updatedUser);
    res.status(200).render('account',{
        title:'account settings',
        user: updatedUser
    });
});