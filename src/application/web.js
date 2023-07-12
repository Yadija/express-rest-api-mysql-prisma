import express from 'express';
import errorMiddleware from '../middleware/errorMiddleware.js';
import userRouter from '../routes/users.js';

export const web = express();
web.use(express.json());

web.use(userRouter);

web.use(errorMiddleware);
