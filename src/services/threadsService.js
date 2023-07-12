import { nanoid } from 'nanoid';
import { prismaClient } from '../application/database.js';

// exceptions
import AuthorizationError from '../exceptions/AuthorizationError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

// utils
import { mapDBToModel } from '../utils/index.js';

class ThreadsService {
  constructor() {
    this._pool = prismaClient;
  }

  async addthread(content, owner) {
    const id = `thread-${nanoid(15)}`;

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const thread = {
      id, content, owner, created_at: createdAt, updated_at: updatedAt,
    };

    const result = await this._pool.thread.create({
      data: thread,
      select: {
        id: true,
      },
    });

    return result.id;
  }

  async getAllThreads() {
    return this._pool.thread.findMany({
      select: {
        id: true,
        content: true,
        owner: true,
      },
    });
  }

  async getThreadById(id) {
    const result = await this._pool.thread.findMany({
      where: {
        id,
      },
    });

    if (!result[0]) {
      throw new NotFoundError('cannot find thread');
    }

    return result.map(mapDBToModel)[0];
  }

  async editThreadById(id, content) {
    const updatedAt = new Date().toISOString();

    await this._pool.thread.update({
      where: {
        id,
      },
      data: {
        content,
        updated_at: updatedAt,
      },
    });
  }

  async deleteThreadById(id) {
    await this._pool.thread.delete({
      where: {
        id,
      },
    });
  }

  async checkThreadIsExist(id) {
    const thread = await this._pool.thread.findFirst({
      where: {
        id,
      },
      select: {
        owner: true,
      },
    });

    if (!thread) {
      throw new NotFoundError('cannot find thread');
    }

    return thread;
  }

  async verifyThreadOwner(id, owner) {
    const thread = await this.checkThreadIsExist(id);

    if (thread.owner !== owner) {
      throw new AuthorizationError('you are not entitled to access this resource');
    }
  }
}

export default ThreadsService;
