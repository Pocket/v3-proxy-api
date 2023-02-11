import request from 'supertest';
import { app, server } from '../main';

describe('supertest setup', () => {
  afterAll(async () => {
    server.close();
  });
  //todo: amend this as we change v3 get response
  it('v3 get call should return 200 and response', async () => {
    const response = await request(app).post('/v3/get');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Ok!');
  });
});
