const express = require('express');
const bookingController = require('../controller/bookingController');
const authController = require('../controller/authController');
const bookingRouter = express.Router();

bookingRouter.get('/checkout-session/:tourId',
            authController.protect,
            bookingController.createCheckoutSession)
 

module.exports = bookingRouter;