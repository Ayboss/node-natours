const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');
const router = express.Router();

router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.get('/logout',authController.logout);
router.post('/forgotpassword',authController.forgotPassword);
router.patch('/resetpassword/:token',authController.resetPassword);

router.use(authController.protect);
router.patch('/updatepassword',authController.updatePassword);
router.patch('/updateme' ,
            userController.uploadUserPhoto ,
            userController.resizeUserPhoto, 
            userController.updateMe);
router.delete('/deleteme',authController.protect,userController.deleteMe);
router.get('/me',userController.getMe, userController.getUser)

router.use(authController.restrictTo('admin'));
router
.route('/')
.get(userController.getAllUsers)
.post(userController.createUser);
router
.route('/:id') 
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);

module.exports = router;
