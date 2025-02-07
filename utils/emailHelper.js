const nodemailer = require("nodemailer"); // npm i nodemailer

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "cloudfile2024@gmail.com",
        pass: "bjlluyfjlptmkibm",
    },
});

const sendEmail = async (email,otp) => {
    const info = {
        from: "ABES- CANTEEN", // sender address
        to:email, // list of receivers
        subject:"OTP verficiation from ABES canteen REgistration" , // Subject line
        
        html:  `<div>
        <p>This is for security purpose</p>
        <p>OTP is: ${otp}</p>
        <p> copy right ABES - CANTEEN</p></div>`, // html body
    };
try{
    const resp = await transporter.sendMail(info);
    console.log("message sent   ",resp.messageId);
    return true;
}
catch(err){
    console.log(err.message);
    return false;
}
   

   // console.log("Message sent: %s", resp.messageId);
};
module.exports ={sendEmail}
