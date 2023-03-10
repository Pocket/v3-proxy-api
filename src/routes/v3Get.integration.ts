import request from 'supertest';
import { app, server } from '../main';
import * as Sentry from '@sentry/node';
import sinon from 'sinon';
import * as GraphQLCalls from '../graph/graphQLClient';

describe('v3Get', () => {
  afterEach(async () => {
    server.close();
    sinon.restore();
  });

  it('should throw 401 for missing access_token', async () => {
    const response = await request(app)
      .post('/v3/get')
      .set('consumer_key', 'test');
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });

  it('should throw 401 for missing consumer_key', async () => {
    const response = await request(app)
      .post('/v3/get')
      .set('access_token', 'test');
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });

  it('should log to Sentry and throw 5xx for unknown errors', async () => {
    const consoleStub = sinon.stub(console, 'log');
    const sentryStub = sinon.stub(Sentry, 'captureException');
    sinon.stub(GraphQLCalls, 'callSavedItems').throws(new Error('test error'));
    const response = await request(app)
      .post('/v3/get')
      .set('consumer_key', 'test')
      .set('access_token', 'test');
    expect(response.status).toBe(500);
    expect(consoleStub.callCount).toBe(1);
    expect(sentryStub.callCount).toBe(1);
    expect(response.body).toEqual({ error: 'v3/get: Error: test error' });
  });
});
