import supertest from 'supertest';
import { web } from '../src/application/web.js';
import {
  createAnotherManyTestThread,
  createAnotherTestUser,
  createManyTestThread,
  createTestThread,
  createTestUser,
  getTestThread,
  removeAllTestAuthentication,
  removeAllTestThread,
  removeAnotherTestUser,
  removeTestUser,
} from './test-util.js';

describe('POST /threads', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestThread();
    await removeAllTestAuthentication();
    await removeTestUser();
  });

  it('should response 201 and create new thread', async () => {
    const { body: { data: { accessToken } } } = await supertest(web)
      .post('/authentications')
      .send({
        username: 'test',
        password: 'secret',
      });

    const result = await supertest(web)
      .post('/threads')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'test',
      });

    expect(result.status).toBe(201);
    expect(result.body.status).toBe('success');
    expect(result.body.data.threadId).toBeDefined();
  });

  it('should response 400 and reject if request content is invalid', async () => {
    const { body: { data: { accessToken } } } = await supertest(web)
      .post('/authentications')
      .send({
        username: 'test',
        password: 'secret',
      });

    const result = await supertest(web)
      .post('/threads')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: '',
      });

    expect(result.status).toBe(400);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();
  });

  it('should response 401 and reject if no authentication', async () => {
    const result = await supertest(web)
      .post('/threads')
      .send({
        content: 'test',
      });

    expect(result.status).toBe(401);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();
  });
});

describe('GET /threads', () => {
  beforeEach(async () => {
    await createTestUser();
    await createAnotherTestUser();
    await createManyTestThread();
    await createAnotherManyTestThread();
  });

  afterEach(async () => {
    await removeAllTestThread();
    await removeTestUser();
    await removeAnotherTestUser();
  });

  it('should response 200 and get all threads', async () => {
    const result = await supertest(web)
      .get('/threads');

    expect(result.status).toBe(200);
    expect(result.body.status).toBe('success');
    expect(result.body.data.threads.length).toBe(10);

    for (let i = 0; i < result.body.data.threads.length; i++) {
      expect(result.body.data.threads[i].id).toBeDefined();
      expect(result.body.data.threads[i].owner).toBeDefined();
      expect(result.body.data.threads[i].content).toBeDefined();
    }
  });
});

describe('GET /threads/:threadId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestThread();
  });

  afterEach(async () => {
    await removeAllTestThread();
    await removeTestUser();
  });

  it('should response 200 and get thread by id', async () => {
    const testThread = await getTestThread();

    const result = await supertest(web)
      .get(`/threads/${testThread.id}`);

    expect(result.status).toBe(200);
    expect(result.body.status).toBe('success');

    expect(result.body.data.thread.id).toBeDefined();
    expect(result.body.data.thread.content).toBe('test');
    expect(result.body.data.thread.owner).toBe('test');
    expect(result.body.data.thread.createdAt).toBeDefined();
    expect(result.body.data.thread.updatedAt).toBeDefined();
  });

  it('should response 404 and cannot get thread', async () => {
    const result = await supertest(web)
      .get('/threads/not_found_id');

    expect(result.status).toBe(404);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();
  });
});

describe('PUT /threads/:threadId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createAnotherTestUser();
    await createTestThread();
  });

  afterEach(async () => {
    await removeAllTestThread();
    await removeAllTestAuthentication();
    await removeTestUser();
    await removeAnotherTestUser();
  });

  it('should response 200 and can update thread', async () => {
    let testThread = await getTestThread();

    const { body: { data: { accessToken } } } = await supertest(web)
      .post('/authentications')
      .send({
        username: 'test',
        password: 'secret',
      });

    const result = await supertest(web)
      .put(`/threads/${testThread.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'update test',
      });

    expect(result.status).toBe(200);
    expect(result.body.status).toBe('success');
    expect(result.body.message).toBeDefined();

    testThread = await getTestThread();
    expect(testThread.content).toBe('update test');
    expect(testThread.content).not.toBe('test');
    expect(testThread.updated_at).not.toBe(testThread.created_at);
  });

  it('should response 400 and reject if request content is invalid', async () => {
    const testThread = await getTestThread();

    const { body: { data: { accessToken } } } = await supertest(web)
      .post('/authentications')
      .send({
        username: 'test',
        password: 'secret',
      });

    const result = await supertest(web)
      .put(`/threads/${testThread.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: '',
      });

    expect(result.status).toBe(400);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();
  });

  it('should response 401 and reject if no authentication', async () => {
    const testThread = await getTestThread();
    const result = await supertest(web)
      .put(`/threads/${testThread.id}`)
      .send({
        content: 'update test',
      });

    expect(result.status).toBe(401);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();
  });

  it('should response 403 and reject if no authorization', async () => {
    const testThread = await getTestThread();

    const { body: { data: { accessToken } } } = await supertest(web)
      .post('/authentications')
      .send({
        username: 'another',
        password: 'secret',
      });

    const result = await supertest(web)
      .put(`/threads/${testThread.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'update test',
      });

    expect(result.status).toBe(403);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();
  });

  it('should response 404 and reject if thread id is invalid', async () => {
    const { body: { data: { accessToken } } } = await supertest(web)
      .post('/authentications')
      .send({
        username: 'test',
        password: 'secret',
      });

    const result = await supertest(web)
      .put('/threads/not_found_id')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'update test',
      });

    expect(result.status).toBe(404);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();
  });
});

describe('DELETE /threads/:threadId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createAnotherTestUser();
    await createTestThread();
  });

  afterEach(async () => {
    await removeAllTestThread();
    await removeAllTestAuthentication();
    await removeTestUser();
    await removeAnotherTestUser();
  });

  it('should response 200 and can delete thread', async () => {
    let testThread = await getTestThread();

    const { body: { data: { accessToken } } } = await supertest(web)
      .post('/authentications')
      .send({
        username: 'test',
        password: 'secret',
      });

    const result = await supertest(web)
      .delete(`/threads/${testThread.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(result.status).toBe(200);
    expect(result.body.status).toBe('success');
    expect(result.body.message).toBeDefined();

    testThread = await getTestThread();
    expect(testThread).toBeNull();
  });

  it('should response 401 and reject if no authentication', async () => {
    const testThread = await getTestThread();
    const result = await supertest(web)
      .delete(`/threads/${testThread.id}`);

    expect(result.status).toBe(401);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();
  });

  it('should response 403 and reject if no authorization', async () => {
    const testThread = await getTestThread();

    const { body: { data: { accessToken } } } = await supertest(web)
      .post('/authentications')
      .send({
        username: 'another',
        password: 'secret',
      });

    const result = await supertest(web)
      .delete(`/threads/${testThread.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(result.status).toBe(403);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();
  });

  it('should response 404 and reject if thread id is invalid', async () => {
    const { body: { data: { accessToken } } } = await supertest(web)
      .post('/authentications')
      .send({
        username: 'test',
        password: 'secret',
      });

    const result = await supertest(web)
      .delete('/threads/not_found_id')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(result.status).toBe(404);
    expect(result.body.status).toBe('fail');
    expect(result.body.message).toBeDefined();
  });
});
