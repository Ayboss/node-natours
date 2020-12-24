const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const factoryController = require('../controller/factoryController');
const catchError = require('../util/catchAsync');
const AppError = require('../util/appError');
const User = require('../models/userModel');

exports.createCheckoutSession = catchError(async (req,res,next) =>{
    //get tour model
    const tour = await Tour.findById(req.params.tourId);
    if(!tour) return next(new AppError('tour does not exist',404));

    //create payment session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        // success_url: `${req.protocol}://${req.get('host')}/?tour=${tour.id}&user=${req.user.id}&price=${tour.price}`,
        success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items:[
            {
                name: `${tour.name} Tour`,
                images:[`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`],
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
// temporal solution without webhook
// exports.createBookingCheckout = catchError(async (req,res,next)=>{
//     const {user, tour, price} = req.query;
//     if(!user && !tour && !price) return next();
//     //create booking
//     await Booking.create({user,tour,price});
//     //redirect to page
//     res.redirect(req.originalUrl.split('?')[0])
// })

const createBooking = catchError(async (session)=>{
    //create booking
    const tour = session.client_reference_id;
    const user = (await User.findOne({email:session.customer_email}))._id;
    const price = session.amount_total/100;
    await Booking.create({user,tour,price});
}) 

exports.webhookCheckout = catchError(async (req,res,next)=>{
    //get the body
    const signature = req.headers['stripe-signature'];
    console.log('signature',signature,'body from weebhook', req.body)
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    }catch(err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if(event.type === 'checkout.session.completed') createBooking(event.data.object);
    res.status(200).json({received: true})
})

exports.getAllBookings = factoryController.getAll(Booking);
exports.createBooking =factoryController.createOne(Booking);
exports.getBooking = factoryController.getOne(Booking);
exports.updateBooking = factoryController.updateOne(Booking)
exports.deleteBooking = factoryController.deleteOne(Booking)