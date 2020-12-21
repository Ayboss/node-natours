const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchError = require('../util/catchAsync');
const AppError = require('../util/appError');

exports.createCheckoutSession = catchError(async (req,res,next) =>{
    //get tour model
    const tour = await Tour.findById(req.params.tourId);
    if(!tour) return next(new AppError('tour does not exist',404));

    //create payment session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${tour.id}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items:[
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                amount: tour.price * 100,
                currency: 'usd',
                quantity: 1
            }
        ]
    })
    res.status(200).json({
        status:'success',
        session
    })
})

exports.createBookingCheckout = catchError(async (req,res,next)=>{
    const {user, tour, price} = req.query;
    if(!user && !tour && !price) return next();
    //create booking
    await Booking.create({user,tour,price});
    //redirect to page
    res.redirect(req.originalUrl.split('?')[0])
})