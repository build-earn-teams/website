// src/utils/mailer.ts
import nodemailer from 'nodemailer';

function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  console.log('mailer: createTransporter -> EMAIL_USER:', user ? user : 'undefined');
  // Use secure true on 465, or port 587 with secure false.
  // Prefer 465 for production with App Passwords.
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user,
      pass
    },
    // Optional: helpful during dev, remove for prod
    // tls: { rejectUnauthorized: false }
  });
}

/** Call at app startup or via test route */
export async function verifyTransporter() {
  const transporter = createTransporter();
  try {
    await transporter.verify();
    console.log('mailer: transporter verified ✅');
    return { ok: true };
  } catch (err) {
    console.error('mailer: transporter verify failed:', err);
    return { ok: false, error: err };
  }
}

export const sendOtpEmail = async (email: string, otp: string) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: `"Freelance Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>OTP Verification</h2>
        <p>Your OTP code is: <b>${otp}</b></p>
        <p>This code will expire in 5 minutes.</p>
      </div>
    `
  };

  console.log(`mailer: sending OTP to ${email}`);
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('mailer: sendMail success:', info);
    // For debugging, info.response may contain SMTP response text
    return info;
  } catch (err) {
    // Log full error object including stack & response (helps identify EAUTH reason)
    console.error('mailer: sendMail error:', err);
    // Re-throw to allow caller to decide whether to rollback user creation
    throw err;
  }
};
