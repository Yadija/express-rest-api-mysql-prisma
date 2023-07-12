import express from 'express';
import errorMiddleware from '../middleware/errorMiddleware.js';

// routers
import authenticationRouter from '../routes/authentications.js';
import userRouter from '../routes/users.js';
import threadRouter from '../routes/threads.js';

export const web = express();
web.use(express.json());

web.use(userRouter);
web.use(authenticationRouter);
web.use(threadRouter);

web.use(errorMiddleware);
