const express =require('express');
const authRouter = require('./Routes/authRoute');
const db_connect = require('./config/db_config');
const app=express();
app.use(express.json());
db_connect();
const cookieParser=require('cookie-parser')

app.use(cookieParser());


app.use('/api/auth',authRouter)

app.use('/',(req,res)=>{
    res.status(200).json({
        data:'JWT Auth Server'
    })
})

module.exports=app;