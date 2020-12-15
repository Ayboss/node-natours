const mongoose = require('mongoose');
const dotenv= require('dotenv');
dotenv.config({path:'./config.env'});
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(con=>{
  console.log('connection successful');
})
.catch(()=>{  
  console.log('DB connection error');
});



console.log(process.env.NODE_ENV)
const port = process.env.PORT;
app.listen(port,()=>{
  console.log('app is listening on port 3000');
});
