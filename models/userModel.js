const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required:[true, 'Please provide your name']
  },
  email:{
    type: String,
    required: [true, 'Pleasae provide an Email'],
    unique: true,
    lowercase:true
  },
  photo:{
    type: String
  },
  role:{
    type:String,
    enum:['user','guide','lead-guide','admin'],
    default: 'user',
  },
  password:{
    type:String,
    required:[true,'Please provide a password'],
    minLength:8,
    select:false
  },
  passwordConfirm:{
    type:String,
    required: [true,'Please provide a confirm password'],
    validate:{
      validator: function(el){
        return this.password === el;
      },
      message:"password doesn't match"
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  isActive:{
    type: Boolean,
    default: true,
    select: false
  }
})

userSchema.pre('save',async function(next){
  if(!this.isModified('password')) return next();
  // hash password
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save',async function(next){
    if(!this.isModified || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function(next){
    this.find({isActive:{$ne : false}});
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword,userPassword);
}

userSchema.methods.isPasswordChanged = function(tokenCreatedTime){
  if(this.passwordChangedAt){
    const passwordTime = parseInt(this.passwordChangedAt.getTime()/1000 ,10);
    return passwordTime > tokenCreatedTime;
  }
  return false;
}
userSchema.methods.createPasswordResetToken = function(){
  // create a restcharacter
  const resetChar = crypto.randomBytes(32).toString('hex')
  //create resettoken
  this.passwordResetToken = crypto.createHash('sha256').update(resetChar).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  //return resetcharacter
  return resetChar;
}
const User = mongoose.model('User',userSchema);

module.exports = User;
