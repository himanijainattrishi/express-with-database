const mongoose = require('mongoose')
const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,

        },
        otp: {
            type: String,
            required: true,

        },
    },
    {
        timestamps: true,


    });
const OTP = mongoose.model("otps", otpSchema);
module.exports = OTP;