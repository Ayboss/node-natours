const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('./../util/appError');
const User = require('./../models/userModel');
const catchError = require('./../util/catchAsync');
const sendEmail = require('./../util/email');

const setJWTToken=(id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES_IN
  });
}

const createSetToken = (res,user,statusCode)=>{
  //login user;
  const token = setJWTToken(user._id);
  const cookieOption = {
    expires: new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  }
  if(process.env.NODE_ENV === 'production') cookieOption.secure = true;
  //send jwt via cookie
  res.cookie('jwt',token,cookieOption);
  //don't return password
  user.password = undefined;
  res.status(200).json({
    status:'success',
    token,
    data:user
  });
}

exports.signup = catchError(async (req,res,next)=>{
  //create a new user
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt
    });
    //login user;
    createSetToken(res,newUser,200);
});

exports.login = catchError(async (req,res,next)=>{
  const {email, password} = req.body;
  //check if email and password
  if(!email || !password){
    return next(new AppError('please provide email and password',400))
  }
  const user = await User.findOne({email:email}).select('+password');
  // check if password matches
  if(!user || !(await user.correctPassword(password, user.password))){
    return next(new AppError('incorrect email or password',401));
  }
    createSetToken(res,user,200);
})

exports.logout =  catchError(async (req,res,next)=>{
  // i logout by sending a new cookie that replaces the old cookie
  res.cookie('jwt','loggout',{
    expires: new Date(Date.now() + (10 * 1000)),
    httpOnly: true
  })
  
  res.status(200).json({status:'success'})
})

exports.forgotPassword = catchError(async(req,res,next)=>{
  // check if email exits
  const user = await User.findOne({email:req.body.email});
  if(!user){
    return next(new AppError('no user with this Email ',404))
  }
  //create token
  const resetToken = user.createPasswordResetToken();
  await user.save({validateBeforeSave: false});
  //send token to user email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/resetpassword/${resetToken}`;
  const message = `Forgot your password, submit a patch request with your new password and password confirm to ${resetURL}. ignore message if you didnt forget password`;
  try{
    await sendEmail({
      email: user.email,
      subject: `Your password reset token, (valid for 10 mins)`,
      message
    })
    res.status(200).json({
      status: "success",
      message: "token sent to your email!"
    })
  }catch(err){
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({validateBeforeSave: false});
    return next(new AppError('there was an error sending the emai, Try again later', 500));
  }
})

exports.protect = catchError(async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers.authorization.split(' ')[1]
      
    }else if(req.cookies){
      token = req.cookies.jwt;
    }
    if(!token){
      return next(new AppError('Please login to acess this route',401));
    }
    //verify token;
    const decode = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    
    //check if user still exits
    const currentUser = await User.findById(decode.id);
    if(!currentUser){
      return next(new AppError('User with token does not exit',401))
    }
    //check if password hasnt been changed since the token was made..
    if(currentUser.isPasswordChanged(decode.iat)){
      return next(new AppError('User recently changed password.. Login in again',401));
    };
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});

exports.isLoginIn = async (req,res,next)=>{
 try{
    if(req.cookies.jwt){   
      //verify token;
      const decode = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET)
      console.log(decode);
      //check if user still exits
      const currentUser = await User.findById(decode.id);
      if(!currentUser){
        return next()
      }
      //check if password hasnt been changed since the token was made..
      if(currentUser.isPasswordChanged(decode.iat)){
        return next();
      };
      res.locals.user = currentUser;
    }
  }catch(err){
    return next();
  }
  return next();
};

exports.restrictTo = (...roles) => {
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return next(new AppError('User doesn\'t have authourization to access this route',403));
    }
    next();
  }
}

exports.resetPassword = catchError(async (req, res, next)=>{
  // get token;
  const tokenreset = req.params.token;
  const tokenHash = crypto.createHash('sha256').update(tokenreset).digest('hex');
  // get user based on resetToken and if resetTokenExp has expired
  const user = await User.findOne({
    passwordResetToken: tokenHash,
     passwordResetExpires:{$gt: Date.now()}
   })
  //check if user exist
  if(!user){
    return next(new AppError('token is expired or invalid',400));
  }
  // set new password and passwordConfirm
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined
  await user.save();
  //send jwt authorization token
    createSetToken(res,user,200);
})

exports.updatePassword = catchError(async (req,res, next) =>{
  //Get user from collection via;
  const user = await User.findById(req.user._id).select("+password");
  console.log(user);
  //match posted password
  if(!(await user.correctPassword(req.body.password, user.password))){
    return next(new AppError('incorrect password', 401));
  }

  //update to new password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  // Log user by sending jwt
  createSetToken(res,user,200);
})
 