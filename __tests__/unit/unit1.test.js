// Import the method and the fetch library
const { fetchLaunches } = require('../../src/app');
const fetch = require('node-fetch');

// Jest allows you to mock entire modules
jest.mock('node-fetch', () => jest.fn());

describe('fetchLaunches', () => {
  beforeEach(() => {
    // Clear mock information between tests
    fetch.mockClear();
  });

  it('should fetch launches successfully', async () => {
    // Mock the fetch response
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ id: 'launch1', name: 'Test Launch' }]), // Example response
    });

    const launches = await fetchLaunches();

    expect(launches).toEqual([{ id: 'launch1', name: 'Test Launch' }]);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://api.spacexdata.com/v4/launches');
  });

  it('should throw an error when the fetch fails', async () => {
    // Mock a failed fetch response
    fetch.mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(fetchLaunches()).rejects.toThrow('Error fetching launches: Not Found');
  });
});
