const AppError = require("../util/appError");

const sendErrorDev = (err,req,res)=>{
  console.error('Error 🤯',err);
  if(req.originalUrl.startsWith('/api')){
    return res.status(err.statusCode).json({
      status:err.status,
      error: err,
      message:err.message,
      stack: err.stack
    })
  } 

  return res.status(err.statusCode).render('error',{
    title:'Somethikng went wrong',
    msg: err.message
  })
}

const sendErrorProd = (err,req,res)=>{
  if(req.originalUrl.startsWith('/api')){
    if(err.isOperational){
        // the devil that we know 
      return res.status(err.statusCode).json({
        status:err.status,
        message:err.message
      })
    }
      // the angel that we don't know
      console.error('Error 🤯',err);
      return res.status(500).json({
        status:'error', 
        message:'Something went very wrong'
      })
      
  }else{
      if(err.isOperational){
        // the devil that we know 
        return res.status(err.statusCode).render('error',{
          title: 'Something went wrong!',
          msg: err.message
        })
      }
        // the angel that we don't know
      console.error('Error 🤯',err);
      return res.status(500).render({
          title: 'Something went wrong!',
          msg: 'Please try again later'
      })
  }
}

handleErrorObjectId =(err)=>{
  return new AppError(`Invalid ${err.path} : ${err.value}`,400);
}

handleDuplicateFieldsDB = err =>{
  let value = err.keyValue.name;
  const message = `Duplicate fields value: ${value}. Please use another value!`;
  return new AppError(message, 400);
}

handleJsonWebTokenError = err =>{
  return new AppError('Token is invalid', 401);
}
handleJsonWebTokenExpiredError = err =>{
  return new AppError('Token is expired, pls sign in again', 401);
}

module.exports = (err,req,res,next)=>{
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';


  if(process.env.NODE_ENV === 'development'){
    sendErrorDev(err,req,res);
  }else if(process.env.NODE_ENV === 'production'){
    let error = {...err};
    if(error.kind === "ObjectId"){
      error = handleErrorObjectId(error);
    }
    if(error.code === 11000){
      error = handleDuplicateFieldsDB(error);
    }
    if(error.name === 'JsonWebTokenError'){
      error = handleJsonWebTokenError(error);
    }
    if(error.name === 'TokenExpiredError'){
      error = handleJsonWebTokenExpiredError(error);
    }

    sendErrorProd(error,req,res);
  }

}
