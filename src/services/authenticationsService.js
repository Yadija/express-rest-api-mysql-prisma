import { nanoid } from 'nanoid';
import { prismaClient } from '../application/database.js';

// exceptions
import InvariantError from '../exceptions/InvariantError.js';

class AuthenticationsService {
  constructor() {
    this._pool = prismaClient;
  }

  async addRefreshToken(token) {
    const id = `auth-${nanoid(15)}`;
    await this._pool.authentication.create({
      data: {
        id,
        token,
      },
    });
  }

  async verifyRefreshToken(token) {
    const totalItemInDatabase = await this._pool.authentication.count({
      where: {
        token,
      },
    });

    if (!totalItemInDatabase) {
      throw new InvariantError('invalid refresh token');
    }
  }

  async deleteRefreshToken(token) {
    await this._pool.authentication.deleteMany({
      where: {
        token,
      },
    });
  }
}

export default AuthenticationsService;
