const cors = require('cors');
const mongoose=require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const app=require('./app');

app.use(cors({
    origin: ['http://localhost:3000','https://api-node-ilsv.onrender.com'],  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
mongoose.connect(process.env.LOCAL_DB)
    .then((connect)=>{ console.log('DB connected Succesfully')})
    .catch((error)=> {  console.log(error)     })


const port=process.env.PORT || 9090;

app.listen(port,()=>{
console.log(`Server Started Successfully.. Running on Port ${port}`);
});