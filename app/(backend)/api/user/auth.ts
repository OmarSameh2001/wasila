// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import crypto from "crypto";
// import bcrypt from "bcrypt";

// // Helper function to generate tokens
// const generateVerificationToken = () => {
//   return crypto.randomBytes(32).toString("hex");
// };

// const hashToken = (token: string) => {
//   return crypto.createHash("sha256").update(token).digest("hex");
// };

// // Email sending function (implement with your email service)
// const sendEmail = async (to: string, subject: string, html: string) => {
//   // TODO: Implement with Resend, SendGrid, etc.
//   console.log(`Sending email to ${to}: ${subject}`);
//   console.log(html);
  
//   // Example with Resend:
//   // const resend = new Resend(process.env.EMAIL_API_KEY);
//   // await resend.emails.send({
//   //   from: process.env.EMAIL_FROM!,
//   //   to,
//   //   subject,
//   //   html,
//   // });
// };

// // Register User (MODIFIED)
// export const registerUser = async (req: NextRequest) => {
//   try {
//     const { email, password, name, username, type } = await req.json();

//     if (!email || !password || !name || !username) {
//       return NextResponse.json(
//         { error: "Please provide all required fields" },
//         { status: 400 }
//       );
//     }

//     // Check if user exists
//     const existingUser = await prisma.user.findFirst({
//       where: {
//         OR: [{ email }, { username }],
//       },
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { error: existingUser.email === email ? "Email already exists" : "Username already exists" },
//         { status: 409 }
//       );
//     }

//     // FIXED: Type validation
//     if (!["USER", "BROKER"].includes(type)) {
//       return NextResponse.json(
//         { error: "Invalid user type. Must be USER or BROKER" },
//         { status: 400 }
//       );
//     }

//     const validatePassword = UserHelper.validatePassword(password);
//     if (!validatePassword.success) {
//       return NextResponse.json(
//         { error: validatePassword.message },
//         { status: 400 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Generate email verification token
//     const verificationToken = generateVerificationToken();
//     const hashedToken = hashToken(verificationToken);
//     const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

//     const createdUser = await prisma.user.create({
//       data: {
//         email,
//         password: hashedPassword,
//         name,
//         username,
//         type,
//         emailVerified: false,
//         emailVerificationToken: hashedToken,
//         emailVerificationExpiry: tokenExpiry,
//       },
//     });

//     // Send verification email
//     const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
//     await sendEmail(
//       email,
//       "Verify Your Email",
//       `
//         <h1>Welcome ${name}!</h1>
//         <p>Please verify your email by clicking the link below:</p>
//         <a href="${verificationUrl}">Verify Email</a>
//         <p>This link will expire in 24 hours.</p>
//         <p>If you didn't create an account, please ignore this email.</p>
//       `
//     );

//     return NextResponse.json(
//       {
//         message: "Registration successful. Please check your email to verify your account.",
//         user: {
//           id: createdUser.id,
//           email: createdUser.email,
//           name: createdUser.name,
//           username: createdUser.username,
//           type: createdUser.type,
//         },
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Register error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// };

// // NEW: Verify Email
// export const verifyEmail = async (req: NextRequest) => {
//   try {
//     const {token} = await req.json();

//     if (!token) {
//       return NextResponse.json(
//         { error: "Verification token is required" },
//         { status: 400 }
//       );
//     }

//     // Hash the token to compare with stored hash
//     const hashedToken = hashToken(token);

//     // Find user with this token
//     const user = await prisma.user.findFirst({
//       where: {
//         emailVerificationToken: hashedToken,
//         emailVerificationExpiry: {
//           gt: new Date(), // Token not expired
//         },
//       },
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "Invalid or expired verification token" },
//         { status: 400 }
//       );
//     }

//     // Update user as verified
//     await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         emailVerified: true,
//         emailVerificationToken: null,
//         emailVerificationExpiry: null,
//       },
//     });

//     return NextResponse.json(
//       {
//         message: "Email verified successfully! You can now log in.",
//         success: true,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Verify email error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// };

// // NEW: Resend Verification Email
// export const resendVerification = async (req: NextRequest) => {
//   try {
//     const { email } = await req.json();

//     if (!email) {
//       return NextResponse.json(
//         { error: "Email is required" },
//         { status: 400 }
//       );
//     }

//     // Find user
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       // Don't reveal if user exists
//       return NextResponse.json(
//         { message: "Verification email has been sent." },
//         { status: 200 }
//       );
//     }

//     if (user.emailVerified) {
//       return NextResponse.json(
//         { error: "Email is already verified" },
//         { status: 400 }
//       );
//     }

//     // Generate new verification token
//     const verificationToken = generateVerificationToken();
//     const hashedToken = hashToken(verificationToken);
//     const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

//     await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         emailVerificationToken: hashedToken,
//         emailVerificationExpiry: tokenExpiry,
//       },
//     });

//     return NextResponse.json(
//       { message: "Verification email has been sent." },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Resend verification error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// };

// // NEW: Forgot Password (Request Reset)
// export const forgotPassword = async (req: NextRequest) => {
//   try {
//     const { email } = await req.json();

//     if (!email) {
//       return NextResponse.json(
//         { error: "Email is required" },
//         { status: 400 }
//       );
//     }

//     // Find user
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     // Always return success to prevent email enumeration
//     if (!user) {
//       return NextResponse.json(
//         { message: "If the email exists, a password reset link has been sent." },
//         { status: 200 }
//       );
//     }

//     // Generate password reset token
//     const resetToken = generateVerificationToken();
//     const hashedToken = hashToken(resetToken);
//     const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

//     await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         passwordResetToken: hashedToken,
//         passwordResetExpiry: tokenExpiry,
//       },
//     });

//     // Send password reset email
//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
//     await sendEmail(
//       email,
//       "Reset Your Password",
//       `
//         <h1>Password Reset Request</h1>
//         <p>Hello ${user.name},</p>
//         <p>You requested to reset your password. Click the link below to proceed:</p>
//         <a href="${resetUrl}">Reset Password</a>
//         <p>This link will expire in 1 hour.</p>
//         <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
//       `
//     );

//     return NextResponse.json(
//       { message: "If the email exists, a password reset link has been sent." },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Forgot password error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// };

// // NEW: Reset Password (Complete Reset)
// export const resetPassword = async (req: NextRequest) => {
//   try {
//     const { token, newPassword } = await req.json();

//     if (!token || !newPassword) {
//       return NextResponse.json(
//         { error: "Token and new password are required" },
//         { status: 400 }
//       );
//     }

//     // Validate password
//     const validatePassword = UserHelper.validatePassword(newPassword);
//     if (!validatePassword.success) {
//       return NextResponse.json(
//         { error: validatePassword.message },
//         { status: 400 }
//       );
//     }

//     // Hash the token to compare with stored hash
//     const hashedToken = hashToken(token);

//     // Find user with this token
//     const user = await prisma.user.findFirst({
//       where: {
//         passwordResetToken: hashedToken,
//         passwordResetExpiry: {
//           gt: new Date(), // Token not expired
//         },
//       },
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "Invalid or expired reset token" },
//         { status: 400 }
//       );
//     }

//     // Hash new password
//     const hashedPassword = await bcrypt.hash(newPassword, 12);

//     // Update password and clear reset token
//     await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         password: hashedPassword,
//         passwordResetToken: null,
//         passwordResetExpiry: null,
//         refreshToken: null, // Invalidate all sessions
//       },
//     });

//     // Send confirmation email
//     await sendEmail(
//       user.email!,
//       "Password Changed",
//       `
//         <h1>Password Changed Successfully</h1>
//         <p>Hello ${user.name},</p>
//         <p>Your password has been changed successfully.</p>
//         <p>If you didn't make this change, please contact support immediately.</p>
//       `
//     );

//     return NextResponse.json(
//       {
//         message: "Password reset successful. You can now log in with your new password.",
//         success: true,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Reset password error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// };