import { generateRandomPhoneSeries } from '../main';

describe('Utility Functions', () => {
  describe('generateRandomPhoneSeries', () => {
    test('should return a valid phone series', () => {
      const series = generateRandomPhoneSeries();
      expect(['Jaguar', 'Leopard', 'Lion']).toContain(series);
    });

    test('should return different values on multiple calls', () => {
      const results = new Set();
      
      // Generate multiple series to test randomness
      for (let i = 0; i < 100; i++) {
        results.add(generateRandomPhoneSeries());
      }
      
      // Should have generated at least 2 different series (allowing for randomness)
      expect(results.size).toBeGreaterThanOrEqual(2);
    });

    test('should only return valid phone series types', () => {
      const validSeries = ['Jaguar', 'Leopard', 'Lion'];
      
      for (let i = 0; i < 100; i++) {
        const series = generateRandomPhoneSeries();
        expect(validSeries).toContain(series);
      }
    });

    test('should eventually generate all three series types', () => {
      const results = new Set();
      
      // Generate enough samples to likely get all three types
      for (let i = 0; i < 1000; i++) {
        results.add(generateRandomPhoneSeries());
      }
      
      expect(results.has('Jaguar')).toBe(true);
      expect(results.has('Leopard')).toBe(true);
      expect(results.has('Lion')).toBe(true);
    });

    test('should have reasonable distribution over many calls', () => {
      const counts = {
        Jaguar: 0,
        Leopard: 0,
        Lion: 0
      };
      
      const iterations = 10000;
      
      for (let i = 0; i < iterations; i++) {
        const series = generateRandomPhoneSeries();
        counts[series]++;
      }
      
      // Each series should appear at least 20% of the time
      // (allowing for some variance in randomness)
      const minExpected = iterations * 0.2;
      expect(counts.Jaguar).toBeGreaterThan(minExpected);
      expect(counts.Leopard).toBeGreaterThan(minExpected);
      expect(counts.Lion).toBeGreaterThan(minExpected);
      
      // Total should equal iterations
      expect(counts.Jaguar + counts.Leopard + counts.Lion).toBe(iterations);
    });
  });
});
