import bcrypt from 'bcrypt';
import { prismaClient } from '../src/application/database.js';

export const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: 'test',
    },
  });
};

export const removeAnotherTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: 'another',
    },
  });
};

export const createTestUser = async () => {
  await prismaClient.user.create({
    data: {
      id: 'test',
      username: 'test',
      password: await bcrypt.hash('secret', 10),
      fullname: 'test',
    },
  });
};

export const createAnotherTestUser = async () => {
  await prismaClient.user.create({
    data: {
      id: 'another',
      username: 'another',
      password: await bcrypt.hash('secret', 10),
      fullname: 'another',
    },
  });
};

export const getTestUser = async () => prismaClient.user.findUnique({
  where: {
    id: 'test',
  },
});

export const removeAllTestAuthentication = async () => {
  await prismaClient.authentication.deleteMany({});
};

export const removeAllTestThread = async () => {
  await prismaClient.thread.deleteMany({});
};

export const createManyTestThread = async () => {
  for (let i = 0; i < 5; i++) {
    await prismaClient.thread.create({
      data: {
        id: `test${i}`,
        content: `test ${i}`,
        owner: 'test',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
  }
};

export const createAnotherManyTestThread = async () => {
  for (let i = 5; i < 10; i++) {
    await prismaClient.thread.create({
      data: {
        id: `test${i}`,
        content: `test ${i}`,
        owner: 'another',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
  }
};

export const createTestThread = async () => {
  await prismaClient.thread.create({
    data: {
      id: 'test',
      content: 'test',
      owner: 'test',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });
};

export const getTestThread = async () => prismaClient.thread.findFirst({
  where: {
    id: 'test',
  },
});
