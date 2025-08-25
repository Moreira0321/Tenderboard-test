import { ServiceCenter, Technician, Customer } from '../main';

// Mock console.log to avoid cluttering test output
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('ServiceCenter', () => {
  let serviceCenter: ServiceCenter;
  let technicians: Technician[];
  let customers: Customer[];

  beforeEach(() => {
    technicians = [
      new Technician('Dalton', 1), // Fast technician for testing
      new Technician('Wapol', 1)
    ];
    
    customers = [
      new Customer('Customer 1', 'Jaguar'),
      new Customer('Customer 2', 'Leopard'),
      new Customer('Customer 3', 'Lion')
    ];
    
    serviceCenter = new ServiceCenter('Test Center', 'Test Address', technicians, customers);
  });

  describe('Constructor', () => {
    test('should create service center with correct initial values', () => {
      expect(serviceCenter.name).toBe('Test Center');
      expect(serviceCenter.repairRecords).toEqual([]);
    });

    test('should create service center with different parameters', () => {
      const center = new ServiceCenter('Another Center', 'Another Address', technicians, customers);
      expect(center.name).toBe('Another Center');
    });
  });

  describe('Getters', () => {
    test('should get name correctly', () => {
      expect(serviceCenter.name).toBe('Test Center');
    });

    test('should get repair records as a copy', () => {
      const records1 = serviceCenter.repairRecords;
      const records2 = serviceCenter.repairRecords;
      
      expect(records1).not.toBe(records2); // Should be different references
      expect(records1).toEqual(records2); // But same content
    });
  });

  describe('startOperating', () => {
    test('should complete all repairs successfully', async () => {
      const startTime = Date.now();
      
      await serviceCenter.startOperating();
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      // Should complete within reasonable time (allowing for async operations)
      expect(duration).toBeLessThan(10);
      
      // Should have repair records for all customers
      expect(serviceCenter.repairRecords.length).toBe(3);
      
      // Verify all customers were served
      const servedCustomers = serviceCenter.repairRecords.map(r => r.customer);
      expect(servedCustomers).toContain('Customer 1');
      expect(servedCustomers).toContain('Customer 2');
      expect(servedCustomers).toContain('Customer 3');
    });

    test('should handle single customer', async () => {
      const singleCustomer = [new Customer('Single Customer', 'Jaguar')];
      const center = new ServiceCenter('Single Center', 'Address', technicians, singleCustomer);
      
      await center.startOperating();
      
      expect(center.repairRecords.length).toBe(1);
      expect(center.repairRecords[0].customer).toBe('Single Customer');
    });

    test('should handle multiple customers with single technician', async () => {
      const singleTechnician = [new Technician('Single Tech', 1)];
      const center = new ServiceCenter('Single Tech Center', 'Address', singleTechnician, customers);
      
      await center.startOperating();
      
      expect(center.repairRecords.length).toBe(3);
      
      // All repairs should be done by the single technician
      const allBySingleTech = center.repairRecords.every(r => r.technician === 'Single Tech');
      expect(allBySingleTech).toBe(true);
    });

    test('should handle empty customer list', async () => {
      const emptyCenter = new ServiceCenter('Empty Center', 'Address', technicians, []);
      
      await emptyCenter.startOperating();
      
      expect(emptyCenter.repairRecords.length).toBe(0);
    });
  });

  describe('Repair Record Validation', () => {
    test('should create valid repair records', async () => {
      await serviceCenter.startOperating();
      
      serviceCenter.repairRecords.forEach(record => {
        expect(record.technician).toBeDefined();
        expect(record.customer).toBeDefined();
        expect(record.phoneSeries).toMatch(/^(Jaguar|Leopard|Lion)$/);
        expect(record.startTime).toBeInstanceOf(Date);
        expect(record.endTime).toBeInstanceOf(Date);
        expect(record.duration).toBeGreaterThan(0);
        expect(record.duration).toBeLessThan(10); // Should be quick for test technicians
      });
    });

    test('should have correct technician assignments', async () => {
      await serviceCenter.startOperating();
      
      const technicianNames = technicians.map(t => t.name);
      serviceCenter.repairRecords.forEach(record => {
        expect(technicianNames).toContain(record.technician);
      });
    });
  });

  describe('Concurrent Operations', () => {
    test('should handle multiple technicians working simultaneously', async () => {
      const fastTech = new Technician('Fast', 0.1);
      const slowTech = new Technician('Slow', 0.5);
      const multiTechCenter = new ServiceCenter('Multi Center', 'Address', [fastTech, slowTech], customers);
      
      const startTime = Date.now();
      await multiTechCenter.startOperating();
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      // With two technicians, should complete faster than sequential
      expect(duration).toBeLessThan(2);
      expect(multiTechCenter.repairRecords.length).toBe(3);
    });
  });

  describe('Error Handling', () => {
    test('should handle technician with zero repair time', async () => {
      const instantTech = new Technician('Instant', 0);
      const center = new ServiceCenter('Instant Center', 'Address', [instantTech], customers);
      
      await center.startOperating();
      
      expect(center.repairRecords.length).toBe(3);
      center.repairRecords.forEach(record => {
        expect(record.duration).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
