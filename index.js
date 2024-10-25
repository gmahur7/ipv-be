require('dotenv').config();
const express = require('express');
const app=express();
const { default: mongoose } = require('mongoose');
const serverless = require('serverless-http')

const connectDB = require('./Config/dbConnect');
connectDB();
const port = process.env.PORT || 8080;

const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
const adminUrl = process.env.ADMIN_URL || 'http://localhost:5173';
// const clientUrl = process.env.CLIENT_URL;
// const adminUrl = process.env.ADMIN_URL;

const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');

app.use(cors({
    origin:[clientUrl,adminUrl],
    methods:['GET','POST','DELETE','PATCH','PUT','OPTIONS'],
    credentials:true
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())

app.get('/',(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"Hello World!"
    })
})

const userRoutes = require('./Routes/UserRoutes');
app.use('/api/user',userRoutes)

const adminRoutes = require('./Routes/AdminRoutes');
app.use('/api/admin',adminRoutes)

app.listen(port,()=>{
    console.log("Server is running at "+port)
})

// This handler function will be invoked by AWS Lambda
// module.exports.handler = async (event, context) => {
//   try {
//     mongoose
//       .connect(process.env.MONGO_URI)
//       .then(() => console.log("mongo db connected to Database ipv"))
//       .catch((err) => console.log(err));
//     return serverless(app)(event, context);
//   } catch (err) {
//     console.error('Error connecting to database:', err);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         error: 'Internal Server Error'
//       })
//     };
//   }

// };