const multer=require('multer');
const customError = require('../utils/ErrorHandler');

// exports.multerStorage=multer.diskStorage({
// destination(req,file,cb){
//     cb(null,'../Uploadfiles/AuthUser_IMG');
// },
// filename(req,file,cb){
//     const extension=file.mimetype.split('/')[1];
//     cb(null,`user-${req.user.id}-${Date.now()}.${extension}`);
// }
// });

// exports.multerFilter=(req,file,cb)=>{
//     if(file.mimetype=='image/jpeg' || file.mimetype=='image/png'){
//         cb(null,true); 
//         }else{
//             cb(null,false);
//             return cb(new customError('Only image files are allowed!',400));
//             }
// };

exports.multerStorage=multer.memoryStorage();


