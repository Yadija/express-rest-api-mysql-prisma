import express from 'express';
import errorMiddleware from '../middleware/errorMiddleware.js';

// routers
import userRouter from '../routes/users.js';
import authenticationRouter from '../routes/authentications.js';

export const web = express();
web.use(express.json());

web.use(userRouter);
web.use(authenticationRouter);

web.use(errorMiddleware);
