import express from 'express';
import errorMiddleware from '../middleware/errorMiddleware.js';

export const web = express();
web.use(express.json());

web.use(errorMiddleware);
