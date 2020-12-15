const fs = require('fs');

const Tour = require('./../models/tourModel');
const Review = require('./../models/reviewModel');
const User = require('./../models/userModel');
const mongoose = require('mongoose');
const dotenv= require('dotenv');
dotenv.config({path:'./../config.env'});
const DB = "mongodb+srv://AyBoss:<PASSWORD>@cluster0.ovtfd.mongodb.net/natours?retryWrites=true&w=majority"
.replace('<PASSWORD>',"P700WCLOeHh2Adp6");
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(con=>{
  console.log('connection successful');
}).catch(()=>{
  console.log('DB connection error');
});

//read file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'))

//import
const importData = async ()=>{
  try{
    await Tour.create(tours);
    await Review.create(reviews);
    await User.create(users);
    console.log('data saved success');

  }catch(err){
      console.log(err)
  }
  process.exit()
}

//delete all data
const deleteData = async ()=>{
  try{
    await Tour.deleteMany()
    await Review.deleteMany()
    await User.deleteMany()
    console.log('data deleted');
  }catch(err){
    console.log(err);
  }
  process.exit()
}

if(process.argv[2] === '--import'){
  importData();
}else if(process.argv[2] === '--delete'){
  deleteData();
}
// console.log(process.argv);
// console.log('yess');
