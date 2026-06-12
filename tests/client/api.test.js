import axios from 'axios';

// Declare a variable to hold the mocked axios.create function
let mockAxiosCreate;
// Declare a variable to hold the mock instance that axios.create will return
let mockAxiosInstance;

jest.mock('axios', () => {
  // Initialize mockAxiosInstance here, within the mock factory,
  // so it's defined when `create` is called.
  mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  // Assign the jest.fn() for create to mockAxiosCreate
  mockAxiosCreate = jest.fn(() => mockAxiosInstance);

  return {
    create: mockAxiosCreate,
    ...mockAxiosInstance, // This spreads the methods for top-level axios calls, if any
  };
});

describe('api.js', () => {
  let apiModule;

  beforeEach(() => {
    jest.resetModules(); // Clears the module registry cache
    // We need to re-mock `axios.create` and the instance methods
    // because `jest.resetModules()` might have cleared the mock functions.
    // Instead of `jest.clearAllMocks()`, we explicitly reset what we care about.

    // Reset the mock functions for the instance that axios.create returns
    mockAxiosInstance.get.mockClear();
    mockAxiosInstance.post.mockClear();
    mockAxiosInstance.put.mockClear();
    mockAxiosInstance.delete.mockClear();

    // Reset the mockAxiosCreate function itself
    mockAxiosCreate.mockClear();

    // Re-import api.js after resetting modules and mocks.
    // This will trigger the `axios.create` call inside api.js.
    apiModule = require('../../client/src/utils/api');
  });

  it('should create an axios instance with a base URL', () => {
    // Now, we assert against the `mockAxiosCreate` function directly
    expect(mockAxiosCreate).toHaveBeenCalledTimes(1);

    const config = mockAxiosCreate.mock.calls[0][0];
    expect(config).toHaveProperty('baseURL');
    expect(config.baseURL).toMatch(/http:\/\/(localhost|test-api.com):\d+\/api/);
  });

  it('should call getContents and return data', async () => {
    const mockData = [{ id: 1, title: 'Content 1' }];

    mockAxiosInstance.get.mockResolvedValueOnce({ data: mockData });

    const result = await apiModule.getContents();
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/contents');
    expect(result).toEqual(mockData);
  });
});
