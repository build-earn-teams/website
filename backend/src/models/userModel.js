import mongoose, { mongo } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import crypto from 'crypto'

const userSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:{
    type:String,
    minLength:[8,"Password atleast have 8 characters"],
    maxLength:[32,"Password should not have 32 characters"],
    select:false
  },
  phone:String,
  accountVerified : {
    type: Boolean , default:false
  },
  verificationCode:Number,
  verrificationCodeExpires:Date,
  resetPasswordToken:String,
  esetPasswordExpire:Date,
  createdAt:{
    type:Date,
    default:Date.now,
  }



})


userSchema.pre("save",async function (next) {
  if(!this.isModified("password")){
    next();
  }
  this.password = await bcrypt.hash(this.password,10)

})


userSchema.methods.comparePassword = async function (enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password)
}


userSchema.methods.generateVerificationCode =  function (){
  function generateRandom5digitCode() {
    const firstDigit  = Math.floor(Math.random() * 9) + 1;
    const remainigDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    return parseInt(firstDigit + remainigDigits);
  }

  const verificationCode = generateRandom5digitCode();
  this.verificationCode = verificationCode;
  this.verrificationCodeExpires = Date.now() + 5 * 60 * 1000; 


  return verificationCode;
}


userSchema.methods.getJWTToken =  function (){
  return  jwt.sign({id:this._id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRE,
  })
}

userSchema.methods.getResetPasswordToken =  function (){
  const resetToken = crypto.randomBytes(20).toString("hex")

  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  this.resetPasswordExpire = Date.now() + 15*60*1000;

  return resetToken;
}

export const User = mongoose.model('User',userSchema)