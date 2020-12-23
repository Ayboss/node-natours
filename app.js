const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');

const AppError = require('./util/appError');
const viewRouter = require('./routes/viewRoute');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const bookingRouter = require('./routes/bookingRoute');
const reviewRouter = require('./routes/reviewRoute');
const globalErrorHandler = require('./controller/errorController');
const bookingController = require('./controller/bookingController');
const cookieParser = require('cookie-parser');
 
const app = express();
app.enable('trust proxy');
app.use(compression());
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')));
//middleware
//set cross origin request headers
app.use(cors()); 
app.options('*',cors());
// set security http headers, lol.... guy learn this stuff
// app.use(helmet());
//development logging
if(process.env.NODE_ENV == 'development'){
  app.use(morgan('dev'));
}

app.post('/webhook-checkout',
      bodyParser.raw({type: 'application/json'}),
      bookingController.webhookCheckout);

//body parser to read data from req
app.use(express.json({limit:'10kb'}));
//allow cookie to be parsed too
app.use(cookieParser());
//allow urlencoded data to parse
app.use(express.urlencoded({extended: true, limit: '10kb'}));
//data sanitization against nosql
app.use(mongoSanitize());
app.use(xss());
app.use(hpp({
  whitelist:[
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'difficulty',
    'price',
    'maxGroupSize'
  ]
}));

const limiter = rateLimit({
max: 100,
windowMs: 60*60*1000,
message: "Too many request from this IP, try again in an hour"
})
//limit no of request
app.use('/api',limiter);

app.use((req,res,next)=>{
  req.setTime = new Date().toISOString();
  next();
}) 



//PUG Route
app.use('/',viewRouter);
// API ROUTES
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews',reviewRouter);
app.use('/api/v1/bookings',bookingRouter);

app.all('*',(req,res,next)=>{
  // res.status(404).json({
  //   status: 'fail',
  //   message:`cant't find ${req.originalUrl} on this server!`
  // });
  // const err = new Error(`cant't find ${req.originalUrl} on this server! through express error handling class`);
  // err.statusCode = 404;
  // err.status = 'fail';

  const err = new AppError(`cant't find ${req.originalUrl} on this server! through express error handling class`,404);
  next(err);
})

app.use(globalErrorHandler);


module.exports = app;
