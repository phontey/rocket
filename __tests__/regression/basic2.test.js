const request = require('supertest');
const { app } = require('../../src/app'); // Update the path as necessary

describe('GET /launches/:id', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('Responds with details for a specific launch', async () => {
        const mockLaunchData = {
            id: '123',
            name: 'Test Launch',
            crew: [], // Assume no crew for simplicity
        };

        // Mock the fetch response for the launch details
        fetch.mockResponseOnce(JSON.stringify(mockLaunchData));

        const response = await request(app).get('/launches/123'); // Use the mock ID
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', '123');
        expect(response.body).toHaveProperty('name', 'Test Launch');
        expect(response.body.crewDetails).toEqual([]); // Check for the augmented data
    });
});
