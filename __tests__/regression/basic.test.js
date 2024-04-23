const request = require('supertest');
const {app} = require('../../src/app');

describe('GET /', () => {

   beforeEach(() => {
      fetch.mockClear();
   });

   it('Respond with default', async() => {
      fetch.mockResponse(JSON.stringify([{id: 1, name: 'Falcon 9'}]));

      const response = await request(app).get('/');  
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('Falcon 9');
   });
});

