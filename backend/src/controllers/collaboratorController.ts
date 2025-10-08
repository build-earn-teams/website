// controllers/collaboratorController.ts (signup only)
import { Request, Response } from 'express';
import CollaboratorModel from '../models/collaboratorModel.js';
import { generateOTP, hashPassword } from '../utils/authUtils.js';
import { sendOtpEmail } from '../utils/mailer.js';
import { verifyTransporter } from '../utils/mailer.js';

const signup = async (req: Request, res: Response) => {
  try {
    console.log("sign up call");
    const { username, email, password } = req.body;

    const existingUser = await CollaboratorModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await hashPassword(password);
    const otp = generateOTP();

    // Create user first (we will rollback if email fails)
    const newUser = await CollaboratorModel.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpVerified: false
    });

    try {
      await sendOtpEmail(email, otp);
    } catch (mailError) {
      console.error('signup: mail sending failed, rolling back user creation', mailError);
      // Rollback: delete the newly created user to avoid orphaned user
      try {
        await CollaboratorModel.deleteOne({ _id: newUser._id });
        console.log('signup: rollback successful, user deleted');
      } catch (delErr) {
        console.error('signup: rollback delete failed', delErr);
      }

      // Respond with detailed but safe error
      return res.status(500).json({
        message: 'Signup failed: unable to send verification email. Please contact support or try again later.',
        error: (mailError && (mailError as any).response) ? (mailError as any).response : mailError
      });
    }

    // If mail succeeded:
    res.status(201).json({
      message: 'User registered successfully. Verify OTP sent to email.',
      userId: newUser._id
    });
  } catch (error) {
    console.error('signup: unexpected error', error);
    res.status(500).json({ message: 'Signup failed', error: error });
  }
};

const testEmail = async (req: Request, res: Response) => {
  const result = await verifyTransporter();
  if (result.ok) return res.status(200).json({ message: 'Email transporter working fine ✅' });
  return res.status(500).json({ message: 'Email transporter verify failed ❌', error: result.error });
};

const getStatus = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Collaborator API is active',
    timestamp: new Date().toISOString()
  });
};


export {signup,getStatus,testEmail}
