const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const express=require('express')
const morgan=require('morgan')
const userRoute=require('./Router/userRoute');
const authRoute=require('./Router/AuthRoute');
const customError = require('./utils/ErrorHandler');
const globalError = require('./Controller/ErrroController');
let app=express();

app.use(express.json());
app.use(require('express-pdf'));
if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
}

app.use('/api/v1/user',userRoute);
app.use('/api/v1/User',authRoute);

app.all("*",(req,res,next)=>{
    const error= new customError("Not Found",501);
    next(error);
})
app.use(globalError);

module.exports=app;