import supertest from 'supertest';
import { web } from '../src/application/web.js';
import { createTestUser, getTestUser, removeTestUser } from './test-util.js';

describe('POST /users', () => {
  afterEach(async () => {
    await removeTestUser();
  });

  it('should response 201 and create new user', async () => {
    const result = await supertest(web)
      .post('/users')
      .send({
        username: 'test',
        password: 'secret',
        fullname: 'test',
      });

    expect(result.status).toBe(201);
    expect(result.body.status).toBe('success');
    expect(result.body.data.userId).toBeDefined();
  });

  it('should response 400 and reject if request is invalid', async () => {
    const result = await supertest(web)
      .post('/users')
      .send({
        username: '',
        password: '',
        fullname: '',
      });

    expect(result.status).toBe(400);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();
  });

  it('should response 400 and reject if username already registered', async () => {
    let result = await supertest(web)
      .post('/users')
      .send({
        username: 'test',
        password: 'secret',
        fullname: 'test',
      });

    expect(result.status).toBe(201);
    expect(result.body.status).toBe('success');
    expect(result.body.data.userId).toBeDefined();

    result = await supertest(web)
      .post('/users')
      .send({
        username: 'test',
        password: 'secret',
        fullname: 'test',
      });

    expect(result.status).toBe(400);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();
  });
});

describe('GET /users/:userId', () => {
  beforeAll(async () => {
    await createTestUser();
  });

  afterAll(async () => {
    await removeTestUser();
  });

  it('should response 200 and get user', async () => {
    const testUser = await getTestUser();

    const result = await supertest(web)
      .get(`/users/${testUser.id}`);

    expect(result.status).toBe(200);
    expect(result.body.status).toBe('success');
    expect(result.body.data.id).toBe('test');
    expect(result.body.data.username).toBe('test');
    expect(result.body.data.fullname).toBe('test');
  });

  it('should response 404 and cannot get user', async () => {
    const testUser = await getTestUser();

    const result = await supertest(web)
      .get(`/users/${testUser.id}random`);

    expect(result.status).toBe(404);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();
  });
});
