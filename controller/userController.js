const User = require('../models/userModel');
const AppError = require('../util/appError');
const catchError = require('../util/catchAsync');
const factoryController = require('./factoryController');

const filterField = (obj,...fields)=>{
    const newObj = {};
    Object.keys(obj).forEach(key=>{
      if(fields.includes(key)) newObj[key] = obj[key]
    });
    return  newObj
}

exports.getAllUsers = factoryController.getAll(User);
exports.getUser = factoryController.getOne(User);
exports.updateUser = factoryController.updateOne(User);
exports.deleteUser = factoryController.deleteOne(User);

exports.getMe = (req, res,next )=>{
  req.params.id = req.user.id;
  return next();
}

exports.createUser = (req,res)=>{
  res.status(500).json({
    status: 'error',
    data: {
      message:'route not defied please use the /sigup'
    }
  })
}

exports.updateMe = catchError(async (req,res,next)=>{
  //send error if user tries updating password;
  if(req.body.password || req.body.passwordConfirm){
    return next(new AppError('cant update password field with this route, use updatepassword instead',401))
  }
  //filter body
  const filteredReq = filterField(req.body,'name','email');
  //update user
  const updatedUser = await User.findByIdAndUpdate(req.user._id,filteredReq,{
    new:true,
    runValidators:true
  })
  console.log('users', updatedUser)
  //send response back
  res.status(200).send({
    status:'success',
    data:{
      user: updatedUser
    }
  })
})

exports.deleteMe = catchError(async (req,res,next)=>{
  //find element, delete element by setting it to inactive
 await User.findByIdAndUpdate(req.user._id, {isActive:false});
  //send response
  res.status(204).send({
    status:'success',
    data: null
  })
});
 