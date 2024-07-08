import express from 'express';

import db_connect from './config/db_config.js';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './Routes/user.route.js';
import errorMiddleware from './middleware/error.middleware.js';
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
app.use(morgan('dev'));

app.use('/ping', (req, res) => {
  res.status(200).json({
    data: 'Pong👋',
  });
});

// Routes of module-----

app.use('/api/v1/user', userRoutes);

app.all('*', (req, res) => {
  res.status(404).send('OOPS!! 404 page not found');
});

app.use(errorMiddleware);

export default app;
