import express from 'express'
import { register,verifyOtp,login, logout, getUser, forgetpassword, resetpassword } from '../controllers/userController.js'
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/otp-verification', verifyOtp);
router.post('/login', login);
router.get("/logout",isAuthenticated,logout);
router.get("/me",isAuthenticated,getUser);
router.post("/password/forgot", forgetpassword);
router.put("/password/reset/:token", resetpassword);
export default router;