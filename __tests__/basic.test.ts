// Basic test to verify test setup
describe('Basic Test Setup', () => {
  test('should run basic test', () => {
    expect(1 + 1).toBe(2);
  });

  test('should handle async operations', async () => {
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });

  test('should handle setTimeout', async () => {
    const start = Date.now();
    await new Promise(resolve => setTimeout(resolve, 10));
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(5);
  });
});
