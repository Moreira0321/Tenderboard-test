import { ServiceCenter, Technician, Customer, generateRandomPhoneSeries } from '../main';

// Mock console.log to avoid cluttering test output
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('Integration Tests', () => {
  describe('Complete Service Center Workflow', () => {
    test('should handle realistic service center scenario', async () => {
      // Create realistic technicians with different speeds
      const dalton = new Technician('Dalton', 2); // 2 seconds per repair
      const wapol = new Technician('Wapol', 3);   // 3 seconds per repair
      const technicians = [dalton, wapol];
      
      // Create multiple customers with different phone series
      const customers = [
        new Customer('Alice', 'Jaguar'),
        new Customer('Bob', 'Leopard'),
        new Customer('Charlie', 'Lion'),
        new Customer('Diana', 'Jaguar'),
        new Customer('Eve', 'Leopard')
      ];
      
      const serviceCenter = new ServiceCenter('Integration Test Center', 'Test Street', technicians, customers);
      
      const startTime = Date.now();
      await serviceCenter.startOperating();
      const endTime = Date.now();
      const totalDuration = (endTime - startTime) / 1000;
      
      // Verify all customers were served
      expect(serviceCenter.repairRecords.length).toBe(5);
      
      // Verify all customers are in the records
      const servedCustomers = serviceCenter.repairRecords.map(r => r.customer);
      customers.forEach(customer => {
        expect(servedCustomers).toContain(customer.name);
      });
      
      // Verify all technicians participated
      const technicianNames = serviceCenter.repairRecords.map(r => r.technician);
      expect(technicianNames).toContain('Dalton');
      expect(technicianNames).toContain('Wapol');
      
      // Verify repair times are reasonable
      serviceCenter.repairRecords.forEach(record => {
        expect(record.duration).toBeGreaterThan(0);
        expect(record.duration).toBeLessThan(10); // Should complete within reasonable time
      });
      
      // Verify total duration is reasonable (should be less than sequential time)
      const maxSequentialTime = 5 * 3; // 5 customers * 3 seconds each
      expect(totalDuration).toBeLessThan(maxSequentialTime);
    });

    test('should handle high load scenario', async () => {
      const fastTech = new Technician('Fast', 0.5);
      const mediumTech = new Technician('Medium', 1);
      const slowTech = new Technician('Slow', 2);
      const technicians = [fastTech, mediumTech, slowTech];
      
      // Create many customers
      const customers = Array.from({ length: 15 }, (_, i) => {
        const phoneSeries = generateRandomPhoneSeries();
        return new Customer(`Customer ${i + 1}`, phoneSeries);
      });
      
      const serviceCenter = new ServiceCenter('High Load Center', 'Busy Street', technicians, customers);
      
      const startTime = Date.now();
      await serviceCenter.startOperating();
      const endTime = Date.now();
      const totalDuration = (endTime - startTime) / 1000;
      
      expect(serviceCenter.repairRecords.length).toBe(15);
      
      // Verify work distribution
      const techWorkload = serviceCenter.repairRecords.reduce((acc, record) => {
        acc[record.technician] = (acc[record.technician] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // All technicians should have done some work
      expect(techWorkload.Fast).toBeGreaterThan(0);
      expect(techWorkload.Medium).toBeGreaterThan(0);
      expect(techWorkload.Slow).toBeGreaterThan(0);
      
      // Total workload should equal customer count
      expect(techWorkload.Fast + techWorkload.Medium + techWorkload.Slow).toBe(15);
    });
  });

  describe('Data Consistency', () => {
    test('should maintain data consistency across operations', async () => {
      const technician = new Technician('Consistency Tech', 1);
      const customer = new Customer('Test Customer', 'Jaguar');
      const serviceCenter = new ServiceCenter('Consistency Center', 'Address', [technician], [customer]);
      
      // Check initial state
      expect(serviceCenter.repairRecords.length).toBe(0);
      expect(technician.isAvailable()).toBe(true);
      
      await serviceCenter.startOperating();
      
      // Check final state
      expect(serviceCenter.repairRecords.length).toBe(1);
      expect(technician.isAvailable()).toBe(true);
      
      const record = serviceCenter.repairRecords[0];
      expect(record.technician).toBe('Consistency Tech');
      expect(record.customer).toBe('Test Customer');
      expect(record.phoneSeries).toBe('Jaguar');
    });

    test('should handle concurrent access to repair records', async () => {
      const technicians = [new Technician('Tech1', 1), new Technician('Tech2', 1)];
      const customers = [
        new Customer('Customer1', 'Jaguar'),
        new Customer('Customer2', 'Leopard')
      ];
      
      const serviceCenter = new ServiceCenter('Concurrent Center', 'Address', technicians, customers);
      
      // Start operation
      const operationPromise = serviceCenter.startOperating();
      
      // Check records during operation (should be empty initially)
      expect(serviceCenter.repairRecords.length).toBe(0);
      
      await operationPromise;
      
      // Check records after operation
      expect(serviceCenter.repairRecords.length).toBe(2);
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    test('should handle service center with no technicians', async () => {
      const customers = [new Customer('Customer', 'Jaguar')];
      const serviceCenter = new ServiceCenter('No Tech Center', 'Address', [], customers);
      
      // This should complete without error, but no repairs will be done
      await serviceCenter.startOperating();
      
      expect(serviceCenter.repairRecords.length).toBe(0);
    }, 5000); // 5 second timeout

    test('should handle service center with no customers', async () => {
      const technicians = [new Technician('Tech', 1)];
      const serviceCenter = new ServiceCenter('No Customer Center', 'Address', technicians, []);
      
      await serviceCenter.startOperating();
      
      expect(serviceCenter.repairRecords.length).toBe(0);
    });

    test('should handle empty service center', async () => {
      const serviceCenter = new ServiceCenter('Empty Center', 'Address', [], []);
      
      await serviceCenter.startOperating();
      
      expect(serviceCenter.repairRecords.length).toBe(0);
    });
  });

  describe('Performance Characteristics', () => {
    test('should demonstrate parallel processing benefits', async () => {
      const singleTech = new Technician('Single', 2);
      const multiTechs = [
        new Technician('Multi1', 2),
        new Technician('Multi2', 2),
        new Technician('Multi3', 2)
      ];
      
      const customers = Array.from({ length: 6 }, (_, i) => 
        new Customer(`Customer ${i + 1}`, 'Jaguar')
      );
      
      // Test single technician
      const singleCenter = new ServiceCenter('Single Center', 'Address', [singleTech], customers);
      const singleStart = Date.now();
      await singleCenter.startOperating();
      const singleDuration = (Date.now() - singleStart) / 1000;
      
      // Test multiple technicians
      const multiCenter = new ServiceCenter('Multi Center', 'Address', multiTechs, customers);
      const multiStart = Date.now();
      await multiCenter.startOperating();
      const multiDuration = (Date.now() - multiStart) / 1000;
      
      // Multi-technician should be faster
      expect(multiDuration).toBeLessThan(singleDuration);
      
      // Both should complete all repairs
      expect(singleCenter.repairRecords.length).toBe(6);
      expect(multiCenter.repairRecords.length).toBe(6);
    });
  });
});
