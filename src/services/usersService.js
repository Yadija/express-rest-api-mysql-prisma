import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { prismaClient } from '../application/database.js';

// exceptions
import InvariantError from '../exceptions/InvariantError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

class UsersService {
  constructor() {
    this._pool = prismaClient;
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(15)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id, username, password: hashedPassword, fullname,
    };

    const result = await this._pool.user.create({
      data: user,
      select: {
        id: true,
      },
    });

    return result.id;
  }

  async verifyNewUsername(username) {
    const count = await this._pool.user.count({
      where: {
        username,
      },
    });

    if (count > 0) {
      throw new InvariantError('username already exists');
    }
  }

  async getUserById(userId) {
    const totalUserInDatabase = await this._pool.user.count({
      where: {
        id: userId,
      },
    });

    if (!totalUserInDatabase) {
      throw new NotFoundError('cannot find user');
    }

    return this._pool.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        fullname: true,
      },
    });
  }
}

export default UsersService;
