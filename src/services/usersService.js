import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { prismaClient } from '../application/database.js';

// exceptions
import AuthenticationError from '../exceptions/AuthenticationError.js';
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
    const user = await this._pool.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        fullname: true,
      },
    });

    if (!user) {
      throw new NotFoundError('cannot find user');
    }

    return user;
  }

  async verifyUserCredential(username, password) {
    const user = await this._pool.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      throw new AuthenticationError('username or password incorrect');
    }

    const { id, password: hashedPassword } = user;

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('username or password incorrect');
    }

    return id;
  }
}

export default UsersService;
