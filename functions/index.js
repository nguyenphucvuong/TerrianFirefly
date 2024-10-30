/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
// Create and deploy your first functions

admin.initializeApp();

// Cấu hình thông tin email (ví dụ: Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // Thay bằng email của bạn
    pass: "your-email-password", // Thay bằng mật khẩu hoặc app password)của bạn
  },
});

// Hàm tạo mã xác nhận 6 chữ số ngẫu nhiên
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Cloud Function để gửi mã xác nhận
exports.sendVerificationCode = functions.https.onCall(async (data, context) => {
  const email = data.email;
  const verificationCode = generateVerificationCode();

  // Cấu hình nội dung email
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Mã xác nhận của bạn",
    text: `Mã xác nhận của bạn là: ${verificationCode}`,
  };

  try {// Gửi email
    await transporter.sendMail(mailOptions);
    // Lưu mã xác nhận vào Firestore (hoặc Realtime Database)
    await admin.firestore().collection("verificationCodes").doc(email).set({
      code: verificationCode,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {message: "Mã xác nhận đã được gửi đến email của bạn."};
  } catch (error) {
    console.error("Error sending email:", error);
    throw new functions.https.HttpsError(
        "internal",
        "Không thể gửi mã xác nhận.");
  }
});
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
