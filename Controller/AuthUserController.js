const Crypto = require('crypto');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const AuthUser = require('../Model/AuthModel');
const aSyncError = require('../utils/aSyncErrorHandler');
const customError = require('../utils/ErrorHandler');
const Common_Check = require('../utils/Common_action');
const sendMail = require('../Communication/Email');
const loadTemplate = require('../utils/LoadEmailTemplates');
const multer_Img = require('../utils/multer_Img_Upload');


exports.Signup = aSyncError(async (req, res, next) => {
    const newUser = await AuthUser.create(req.body);

    const token = Common_Check.signToken(newUser._id);

    let userDetails = {
        name: newUser.name,
        email: newUser.email,
    };

    try {
        const htmlContent = await loadTemplate('../Templates/Email_Templates/registration-success.html', userDetails.name);
        await sendMail(userDetails, 'Registration Successful', htmlContent);
    } catch (err) {
        console.error('Error processing email:', err);
    }
    newUser.password = undefined;
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.Login = aSyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        const error = new customError("Please Provide Email id and Password.", 400);
        console.log(error);
        return next(error);
    }
    const user = await AuthUser.findOne({ email });
    let PasswordMatch;
    if(user!=null){
        PasswordMatch = await Common_Check.comparePasswordInDb(password, user.password);
    }
    
    if (!user || !PasswordMatch) {
        const error = new customError("Invalid Email or Password.", 401);
        return next(error);
    }

    const token = Common_Check.signToken(user._id);
    user.password = undefined;
    res.status(200).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
});

exports.restrict = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            const error = new customError("You Do not have Permission to perform this action", 403);
            return next(error);
        }
        next();
    }
};

exports.forgotPassword = aSyncError(async (req, res, next) => {
    const user = await AuthUser.findOne({ email: req.body.email });
    if (!user) {
        const error = new customError("We could not find the user with given email", 404);
        return next(error);
    }
    const [resetToken, hashedToken, resetExpires] = Common_Check.generateResetToken();

    user.passwordResetToken = hashedToken;
    user.passwordResetTokenExpriere = resetExpires;

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`;

    const userDetails = {
        email: user.email,
        resetUrl: resetUrl,
        name: user.name
    };
    try {
        const htmlContent = await loadTemplate('../Templates/Email_Templates/password-resetTemp.html', userDetails);
        await sendMail(userDetails, 'Reset Password Link', htmlContent);

    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpriere = undefined;

        await user.save({ validateBeforeSave: false });

        const error = new customError("There was an error Sending Password reset email.", 500);
        return next(error);
    }

    res.status(200).json({
        status: 'success',
        data: {
            message: 'Done'
        }
    })
});

exports.resetPassword = aSyncError(async (req, res, next) => {
    const token = Crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await AuthUser.findOne({
        passwordResetToken: token,
        passwordResetTokenExpriere: { $gt: Date.now() }
    });

    if (!user) {
        const error = new customError("Token is Invalid or has expried.", 400);
        return next(error);
    }
    user.password = req.body.pasword;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpriere = undefined;
    user.passwordChangedAt = Common_Check.dateFormate(Date.now());
    user.save();

    const resetLoginToken = Common_Check.signToken(user._id);
    res.status(200).json({
        status: 'success',
        token: resetLoginToken,
        data: {
            message: 'Password Updated Successfully'
        }
    })
});

const upload = multer({
    storage: multer_Img.multerStorage,
    fileFilter: multer_Img.multerFilter
});

//exports.uploadUserPhoto=aSyncError(upload.single('photo'));
exports.uploadUserPhoto = aSyncError(async (req, res, next) => {
    await upload.single('photo')(req, res, (err) => {
        if (err) {
            return next(err);
        }
        if (!req.file) {
            const error = new customError('Please upload a photo.', 400);
            return next(error);
        }
        req.body.photo = req.file.filename;
        next();
    });
});

exports.imageProcessing = aSyncError(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    let i = sharp(req.file.buffer).resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`./Uploadfiles/AuthUser_IMG/${req.file.filename}`);
    console.log(i);
    next();
})

exports.updateAuthProfileUser = aSyncError(async (req, res, next) => {
    console.log(req.photo);
    console.log(req.file);
    console.log(req.params.id);
    const users = await AuthUser.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    })
});


exports.AuthProfilepdf = aSyncError(async (req, res, next) => {
    const options = {
        format: 'A4',
        orientation: 'portrait',
        border: '10mm',
    };

    const htmlPath = path.resolve(__dirname, '../Templates/Email_Templates/registration-success.html');
    
    res.pdfFromHTML(htmlPath, options, (err, result) => {
        if (err) {
            console.error('Error generating PDF:', err);
            return res.status(500).send('Error generating PDF');
        }

        res.download(result.filename, 'generated.pdf');
    });
});
//    Nandan 
//    new changes
