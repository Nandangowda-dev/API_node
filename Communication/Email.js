const dotenv=require('dotenv');
dotenv.config({path:'./../config.env'});
const nodemailer=require('nodemailer');

const sendEmail=(userDetails,Subject,htmlTemplate)=>{
    
    const transporter = nodemailer.createTransport({
        service:process.env.USER_EMAIL, 
        auth: {
            user:process.env.USER_EMAIL, 
            pass:process.env.PASS_EMAIL
        }
    });
    const emailOptions={
        from:process.env.USER_EMAIL,
        to : userDetails.email,
        subject : Subject,
        html: htmlTemplate
    }
    transporter.sendMail(emailOptions, (err, info) => {
        if (err) {  
            console.error('Error sending email:', err);
            return;  
        }
        console.log('Email sent successfully:', info.response);
    });
};

module.exports=sendEmail;