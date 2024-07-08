const express = require('express');
const authRouter = require('./Routes/authRoute');
const db_connect = require('./config/db_config');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
app.use(express.json());
db_connect();

app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);

app.use('/', (req, res) => {
    res.status(200).json({
        data: 'JWT Auth Server',
    });
});

// Routes of module-----
app.use('/api/auth', authRouter);

app.all('*',(req,res)=>{
    res.status(404).send('OOPS!! 404 page not found')
})


module.exports = app;
