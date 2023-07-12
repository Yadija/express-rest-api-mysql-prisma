import supertest from 'supertest';
import { web } from '../src/application/web.js';
import { createTestUser, removeAllTestAuthentication, removeTestUser } from './test-util.js';

describe('POST /authentications', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestAuthentication();
    await removeTestUser();
  });

  it('should response 201 and create new token', async () => {
    const result = await supertest(web)
      .post('/authentications')
      .send({
        username: 'test',
        password: 'secret',
      });

    expect(result.status).toBe(201);
    expect(result.body.status).toBe('success');
    expect(result.body.data.accessToken).toBeDefined();
    expect(result.body.data.accessToken).not.toBe('');
    expect(result.body.data.refreshToken).toBeDefined();
    expect(result.body.data.refreshToken).not.toBe('');
  });

  it('should response 401 and reject if username is wrong', async () => {
    const result = await supertest(web)
      .post('/authentications')
      .send({
        username: 'wrong',
        password: 'wrong',
      });

    expect(result.status).toBe(401);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();
  });

  it('should response 401 and reject if password is wrong', async () => {
    const result = await supertest(web)
      .post('/authentications')
      .send({
        username: 'test',
        password: 'wrong',
      });

    expect(result.status).toBe(401);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();
  });
});

describe('PUT /authentications', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestAuthentication();
    await removeTestUser();
  });

  it('should response 200 and create new access token', async () => {
    const { body: { data: { refreshToken } } } = await supertest(web)
      .post('/authentications')
      .send({
        username: 'test',
        password: 'secret',
      });

    const result = await supertest(web)
      .put('/authentications')
      .send({
        refreshToken,
      });

    expect(result.status).toBe(200);
    expect(result.body.status).toBe('success');
    expect(result.body.data.accessToken).toBeDefined();
    expect(result.body.data.accessToken).not.toBe('');
  });

  it('should response 400 and cannot update if refresh token is invalid', async () => {
    const result = await supertest(web)
      .put('/authentications')
      .send({
        refreshToken: 'invalid_refresh_token',
      });

    expect(result.status).toBe(400);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();
  });
});

describe('DELETE /authentications', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestAuthentication();
    await removeTestUser();
  });

  it('should response 200 and delete token', async () => {
    const { body: { data: { refreshToken } } } = await supertest(web)
      .post('/authentications')
      .send({
        username: 'test',
        password: 'secret',
      });

    const result = await supertest(web)
      .delete('/authentications')
      .send({
        refreshToken,
      });

    expect(result.status).toBe(200);
    expect(result.body.status).toBe('success');
    expect(result.body.message).toBeDefined();
  });

  it('should response 400 and cannot delete if refresh token is invalid', async () => {
    const result = await supertest(web)
      .put('/authentications')
      .send({
        refreshToken: 'invalid_refresh_token',
      });

    expect(result.status).toBe(400);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();
  });
});
