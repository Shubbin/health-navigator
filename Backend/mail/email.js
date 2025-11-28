import { resend, sender } from "./resend.config.js";
import {
  verificationEmailTemplate,
  resetPasswordTemplate,
  resetSuccessTemplate,
  welcomeEmailTemplate,
} from "./emailTemplates.js";

// Send verification email
export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  try {
    const { data, error } = await resend.emails.send({
      from: sender,
      to: [email],
      subject: "Verify Your Email",
      html: verificationEmailTemplate(verificationLink),
    });

    if (error) throw new Error(`Verification email failed: ${error.message}`);
    console.log("Verification email sent:", data);
  } catch (err) {
    console.error("Verification email error:", err);
    throw err;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: sender,
      to: [email],
      subject: "Welcome to Our Platform!",
      html: welcomeEmailTemplate(name),
    });

    if (error) throw new Error(`Welcome email failed: ${error.message}`);
    console.log("Welcome email sent:", data);
  } catch (err) {
    console.error("Welcome email error:", err);
    throw err;
  }
};

// Send reset password email
export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const { data, error } = await resend.emails.send({
      from: sender,
      to: [email],
      subject: "Reset Your Password",
      html: resetPasswordTemplate(resetURL),
    });

    if (error) throw new Error(`Reset password email failed: ${error.message}`);
    console.log("Password reset email sent:", data);
  } catch (err) {
    console.error("Password reset email error:", err);
    throw err;
  }
};

// Send password reset success email
export const sendResetSuccessEmail = async (email) => {
  try {
    const { data, error } = await resend.emails.send({
      from: sender,
      to: [email],
      subject: "Your Password Has Been Reset",
      html: resetSuccessTemplate(),
    });

    if (error) throw new Error(`Reset success email failed: ${error.message}`);
    console.log("Password reset success email sent:", data);
  } catch (err) {
    console.error("Reset success email error:", err);
    throw err;
  }
};
