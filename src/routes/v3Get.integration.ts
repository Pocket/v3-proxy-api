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
      .send({ consumer_key: 'test' });
    expect(response.status).toBe(401);
    const expectedHeaders = {
      'X-Error-Code': '107',
      'X-Error':
        'A valid access token is required to access the requested API endpoint.',
    };
    expect(response.headers['x-error-code']).toBe(
      expectedHeaders['X-Error-Code']
    );
    expect(response.headers['x-error']).toBe(expectedHeaders['X-Error']);
  });

  it('should throw 401 for missing consumer_key', async () => {
    const response = await request(app)
      .post('/v3/get')
      .send({ access_token: 'test' });
    expect(response.status).toBe(400);
    const expectedHeaders = {
      'X-Error-Code': '132',
      'X-Error': 'Missing API key. Get an API key at http://getpocket.com/api',
    };
    expect(response.headers['x-error-code']).toBe(
      expectedHeaders['X-Error-Code']
    );
    expect(response.headers['x-error']).toBe(expectedHeaders['X-Error']);
  });

  it('should log to Sentry and throw 5xx for unknown errors', async () => {
    const consoleStub = sinon.stub(console, 'log');
    const sentryStub = sinon.stub(Sentry, 'captureException');
    sinon.stub(GraphQLCalls, 'callSavedItems').throws(new Error('test error'));
    const response = await request(app)
      .post('/v3/get')
      .send({ consumer_key: 'test', access_token: 'test' });
    expect(response.status).toBe(500);
    expect(consoleStub.callCount).toBe(1);
    expect(sentryStub.callCount).toBe(1);
    expect(response.body).toEqual({ error: 'v3/get: Error: test error' });
  });
});
