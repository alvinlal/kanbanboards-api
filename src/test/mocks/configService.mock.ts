export const mockConfigService = {
  get(key) {
    return jest.fn().mockReturnValue(key);
  },
};
