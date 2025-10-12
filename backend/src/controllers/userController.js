import ErrorHandler from "../middleware/error.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import twilio from "twilio";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";

const client = twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN)



export const register = catchAsyncError(async (req,res,next)=>{
  try {

    const{name,email,phone,password, verificationMethod} = req.body
    if(!name || !email || !phone || !password || !verificationMethod){
      return next(new ErrorHandler("Please enter all fields",400))
    }
    function phoneNumberIsValid(phone){
      const phoneRegex = /^\+91\d{10}$/;
      return phoneRegex.test(phone);
    }
    if(!phoneNumberIsValid(phone)){
      return next(new ErrorHandler("Please enter valid phone number",400))
    }

    const existuser = await User.findOne({
      $or:[{
        email,
        accountVerified:true
      },
    {
      phone,
      accountVerified:true
    }]
    })
    
    if(existuser){
      return next(new ErrorHandler("User already exist",400))
    }

    const registerationAttemptsByUser = await User.find({
      $or:[
        {email,
        accountVerified:false
        },
        {phone,
        accountVerified:false
        } 
      ]
    })

    if(registerationAttemptsByUser.length >3){
      return next(new ErrorHandler("Too many registration attempts try again after an hour",400))
    }


    const userData = {
      
      name,
      email,
      phone,
      password,
      
    }


    const user = await User.create(userData)

    const verificationCode = await user.generateVerificationCode()
    await user.save()

    sendVerificationCode(verificationMethod,verificationCode,name,email,phone,res)
   

    async function sendVerificationCode(verificationMethod,verificationCode,name,email,phone,res){
      try {
        if(verificationMethod === "email"){
        const message = generateEmailTemplate(verificationCode);
        sendEmail(email,message,"Verification code for BuildnEarn")
         res.status(200).json({
      success:true,
      message:`Verification code sent to your ${name}`
    })

      }else if(verificationMethod === "phone"){
        const verificationCodeWithSpace  = verificationCode.toString().split('').join(' ');

        await client.messages.create({
          body:`Your BuildnEarn verification code is ${verificationCodeWithSpace}. It will expire in 5 minutes.`,
          from:process.env.TWILIO_PHONE_NUMBER,
          to:phone
        })
         res.status(200).json({
      success:true,
      message:`Otp sent`
    })
      }else{
        return res.status(500).json({
          status:false,
          message:"Invalid verification method"
        })
      }
      } catch (error) {
        return res.status(500).json({
          status:false,
          message:"verification code failed to sent"
        })
      }
    }

    function generateEmailTemplate(code) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Welcome to BuildnEarn!</h2>
      <p style="font-size: 16px;">Hi there,</p>
      <p style="font-size: 16px;">Thank you for registering. Please use the verification code below to complete your sign-up process.</p>
      <div style="background-color: #f4f4f4; margin: 20px 0; padding: 15px; text-align: center; border-radius: 5px;">
        <h3 style="font-size: 24px; color: #555; letter-spacing: 5px; margin: 0;">${code}</h3>
      </div>
      <p style="font-size: 14px; color: #888;">This code will expire in 5 minutes.</p>
      <p style="font-size: 14px;">If you did not request this code, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #ddd;" />
      <p style="text-align: center; font-size: 12px; color: #aaa;">&copy; 2025 BuildnEarn</p>
    </div>
  `;

}


  } catch (error) {
    next(error)
  }
})


export const verifyOtp = catchAsyncError(async (req,res,next)=>{

  const {email,otp,phone}=req.body;
  function phoneNumberIsValid(phone){
      const phoneRegex = /^\+91\d{10}$/;
      return phoneRegex.test(phone);
    }
    if(!phoneNumberIsValid(phone)){
      return next(new ErrorHandler("Please enter valid phone number",400))
    }

    try {

      const userAllEntries = await User.find({
        $or:[
          {email,
          accountVerified:false
          },
          {phone,
          accountVerified:false
          } 
        ]
      }).sort({createdAt:-1})

      if(userAllEntries.length === 0){
        return next(new ErrorHandler("User not found",404))
      }

      let user;
      if(userAllEntries.length > 0){
        user = userAllEntries[0];
        await User.deleteMany({
          _id:{$ne:user._id},
          $or:[
            {email,
            accountVerified:false
            },
            {phone,
            accountVerified:false
            } 
          ]
        }) 
      }
      else{
        user = userAllEntries[0];
      }

      if(user.verificationCode !== Number(otp)){
      return next(new ErrorHandler("Please enter valid otp",400))
      }

      const currentTime = Date.now(); 
      const verificationCodeExpire = new Date(user.verificationCodeExpiry).getTime();

      if(currentTime > verificationCodeExpire){
        return next(new ErrorHandler("Otp has been expired please try again",400))
      }

      user.accountVerified = true;
      user.verificationCode = null;
      user.verificationCodeExpiry = null;
      
      await user.save({validateModifiedOnly:true});

      sendToken(user,200,"Account verified successfully",res)
      


    } catch (error) {
      return next(new ErrorHandler(error.message,500))
    }
})


export const login = catchAsyncError(async (req,res,next)=>{

  const {email,password} = req.body;

  if(!email || !password){
    return next(new ErrorHandler("Please provide email and password",400))
  }

  const user = await User.findOne({email}).select("+password");
  if(!user){
    return next(new ErrorHandler("Invalid email or password",401))
  }

  const isMatch = await user.comparePassword(password);
  if(!isMatch){
    return next(new ErrorHandler("Invalid email or password",401))
  }

  sendToken(user,200,"Login successful",res)

})


export const logout = catchAsyncError(async (req,res,next)=>{
  res.cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true,
  })

  res.status(200).json({
    success:true,
    message:"Logged out successfully"
  })
})



export const getUser = catchAsyncError(async (req,res,next)=>{
  const user = await User.findById(req.user._id)

  res.status(200).json({
    success:true,
    user
  })
})    


export const forgetpassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email, accountVerified: true });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Generate and set reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it.`;

  try {
    await sendEmail(user.email, message, "BuildnEarn Password Recovery Message");

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
      user
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});



export const resetpassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;

  console.log("Received reset token:", token);

  // Hash the token to compare with DB
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

  console.log("Hashed token:", resetPasswordToken);
  // console.log(user)

  // Find user with matching token and valid expiry
  const user = await User.findOne({
    resetPasswordToken,
    

  });

  if (!user) {
    return next(new ErrorHandler("Reset password token is invalid or has expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, "Password changed successfully", res);
});
