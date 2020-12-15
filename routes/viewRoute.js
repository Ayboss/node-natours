const express = require('express');
const viewController = require('./../controller/viewController');
const authController = require('./../controller/authController');
const router = express.Router();

//PUG TEMPLATE
router.get('/me', authController.protect, viewController.userAccount)
router.post('/submit-user-data', 
    authController.protect, 
    viewController.updateUserData);

router.use(authController.isLoginIn);
router.get('/',viewController.getOverview);
router.get('/tour/:tourSlug', viewController.getTour);
router.get('/login', viewController.login)


          
module.exports = router;