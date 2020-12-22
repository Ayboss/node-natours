const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Review = require('./../models/reviewModel');
const Booking = require('./../models/bookingModel');
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
    });
    res.status(200).render('account',{
        title:'account settings',
        user: updatedUser
    });
});
exports.getUserTour = catchAsync(async (req,res,user)=>{
    //get booking based on user
    const bookings = await Booking.find({user: req.user.id});
    //get all the tours
    const tourId = bookings.map(el=> el.tour);
    //get all tours based on the ids
    const tours = await Tour.find({_id:{$in: tourId}});
    //render the overview page
    res.status(200).render('overview',{
        title:'My booking',
        tours
    });
})