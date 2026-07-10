import request from 'supertest';
import app from '../src/app.js';

describe('Express App Endpoints', () => {
  it('should return HTTP 200 and success message on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Continuous Integration Project Running Successfully');
  });

  it('should return HTTP 404 for non-existent routes', async () => {
    const response = await request(app).get('/non-existent-route');
    expect(response.statusCode).toBe(404);
  });
});
