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
const port = process.env.PORT || 3000;
const server = app.listen(port,()=>{
  console.log('app is listening on port 3000');
});

process.on('unhandledRejection',err=>{
  console.log('UNHANDLED REJECTION! Shutting down');
  console.log(err.name, err.message);
  server.close(()=>{
    process.exit(1);
  });
})

process.on('SIGTERM',()=>{
  console.log('SIGTERM received. shutting down gracefully');
  server.close(()=>{
    console.log('process terminated');
  })
});
