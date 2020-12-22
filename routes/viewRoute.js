const express = require('express');
const viewController = require('./../controller/viewController');
const authController = require('./../controller/authController');
const bookingController = require('./../controller/bookingController');
const router = express.Router();

//PUG TEMPLATE
router.get('/me', authController.protect, viewController.userAccount)
router.get('/my-tour', authController.protect, viewController.getUserTour)
router.post('/submit-user-data', 
    authController.protect, 
    viewController.updateUserData);

router.get('/',
        bookingController.createBookingCheckout,
        authController.isLoginIn,
        viewController.getOverview);    
router.use(authController.isLoginIn);
router.get('/tour/:tourSlug', viewController.getTour);
router.get('/login', viewController.login)


          
module.exports = router;