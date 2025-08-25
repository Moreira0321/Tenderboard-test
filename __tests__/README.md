# Unit Tests for Phonetic Service Center

This directory contains comprehensive unit tests for the Phonetic Service Center Simulation.

## Quick Start

To run all tests:
```bash
npm test
# or
yarn test
# or on Windows
run-tests.bat
```

## Test Files

### `basic.test.ts`
- Simple tests to verify the test environment is working
- Tests basic Jest functionality and async operations

### `technician.test.ts`
- Tests for the `Technician` class
- Covers constructor, getters/setters, `isAvailable()`, and `repairing()` methods
- Tests timing accuracy and status transitions

### `customer.test.ts`
- Tests for the `Customer` class
- Covers constructor, getters/setters, and edge cases
- Validates phone series types

### `service-center.test.ts`
- Tests for the `ServiceCenter` class
- Covers the main workflow and various scenarios
- Tests concurrent operations and error handling

### `utils.test.ts`
- Tests for utility functions like `generateRandomPhoneSeries()`
- Validates randomness and distribution

### `integration.test.ts`
- End-to-end tests for the complete system
- Tests realistic scenarios and performance characteristics
- Validates data consistency across operations

## Test Features

### Async Testing
Tests use `async/await` for testing Promise-based operations:
```typescript
test('should complete repair', async () => {
  const result = await technician.repairing(customer);
  expect(result.duration).toBeGreaterThan(0);
});
```

### Console Mocking
Console.log is mocked to keep test output clean:
```typescript
beforeAll(() => {
  console.log = jest.fn();
});
```

### Timing Validation
Tests include reasonable timing expectations:
```typescript
expect(record.duration).toBeGreaterThanOrEqual(expectedDuration * 0.8);
expect(record.duration).toBeLessThanOrEqual(expectedDuration * 1.2);
```

### Edge Case Coverage
Tests handle various edge cases:
- Empty arrays
- Single items
- Invalid inputs
- Boundary conditions

## Running Specific Tests

To run a specific test file:
```bash
npm test -- technician.test.ts
```

To run tests in watch mode:
```bash
npm run test:watch
```

To run tests with coverage:
```bash
npm test -- --coverage
```

## Test Structure

Each test file follows this pattern:
1. **Imports** - Import the classes/functions to test
2. **Setup** - Mock console.log and create test data
3. **Test Groups** - Use `describe()` to group related tests
4. **Individual Tests** - Use `test()` or `it()` for specific test cases
5. **Cleanup** - Restore console.log in `afterAll()`

## Expected Results

When tests run successfully, you should see:
- ✅ All tests passing
- 📊 Coverage report (if enabled)
- ⏱️ Tests completing within 30 seconds
- 🔇 No console output (due to mocking)

## Troubleshooting

### Common Issues

1. **Import errors**: Make sure classes are exported from main.ts
2. **Timeout errors**: Increase timeout in jest.config.js if needed
3. **Type errors**: Check TypeScript configuration includes test files
4. **PowerShell execution policy**: Use `run-tests.bat` on Windows

### Debugging

To debug a specific test:
```typescript
test('debug test', () => {
  debugger; // Add breakpoint
  // Your test code here
});
```

Run with Node.js debugger:
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```
