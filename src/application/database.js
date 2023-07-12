import { PrismaClient } from '@prisma/client';
import { logger } from './logging';

export const prismaClient = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

prismaClient.$on('error', (error) => {
  logger.error(error);
});

prismaClient.$on('warn', (error) => {
  logger.warn(error);
});

prismaClient.$on('info', (error) => {
  logger.info(error);
});

prismaClient.$on('query', (error) => {
  logger.info(error);
});
