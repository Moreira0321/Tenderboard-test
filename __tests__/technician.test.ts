import { Technician, Customer } from '../main';

// Mock console.log to avoid cluttering test output
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('Technician', () => {
  let technician: Technician;

  beforeEach(() => {
    technician = new Technician('Test Tech', 5);
  });

  describe('Constructor', () => {
    test('should create a technician with correct initial values', () => {
      expect(technician.name).toBe('Test Tech');
      expect(technician.averageRepairTime).toBe(5);
      expect(technician.status).toBe('idle');
      expect(technician.currentCustomer).toBeNull();
    });
  });

  describe('Getters and Setters', () => {
    test('should set and get name correctly', () => {
      technician.name = 'New Name';
      expect(technician.name).toBe('New Name');
    });

    test('should set and get averageRepairTime correctly', () => {
      technician.averageRepairTime = 10;
      expect(technician.averageRepairTime).toBe(10);
    });

    test('should get status correctly', () => {
      expect(technician.status).toBe('idle');
    });

    test('should get currentCustomer correctly', () => {
      expect(technician.currentCustomer).toBeNull();
    });
  });

  describe('isAvailable', () => {
    test('should return true when status is idle', () => {
      expect(technician.isAvailable()).toBe(true);
    });

    test('should return false when status is working', async () => {
      const customer = new Customer('Test Customer', 'Jaguar');
      const repairPromise = technician.repairing(customer);
      
      // Check during repair
      expect(technician.isAvailable()).toBe(false);
      
      // Wait for repair to complete
      await repairPromise;
      
      // Check after repair
      expect(technician.isAvailable()).toBe(true);
    });
  });

  describe('repairing', () => {
    test('should start repair and return repair record', async () => {
      const customer = new Customer('Test Customer', 'Jaguar');
      const startTime = new Date();
      
      const repairPromise = technician.repairing(customer);
      
      // Check that technician is now working
      expect(technician.status).toBe('working');
      expect(technician.currentCustomer).toBe(customer);
      
      const repairRecord = await repairPromise;
      
      // Verify repair record
      expect(repairRecord.technician).toBe('Test Tech');
      expect(repairRecord.customer).toBe('Test Customer');
      expect(repairRecord.phoneSeries).toBe('Jaguar');
      expect(repairRecord.startTime).toBeInstanceOf(Date);
      expect(repairRecord.endTime).toBeInstanceOf(Date);
      expect(repairRecord.duration).toBeGreaterThan(0);
      
      // Check that technician is idle again
      expect(technician.status).toBe('idle');
      expect(technician.currentCustomer).toBeNull();
    });

    test('should respect average repair time', async () => {
      const customer = new Customer('Test Customer', 'Lion');
      const startTime = new Date();
      
      const repairRecord = await technician.repairing(customer);
      
      const actualDuration = repairRecord.duration;
      const expectedDuration = 5; // averageRepairTime
      
      // Allow some tolerance for timing variations
      expect(actualDuration).toBeGreaterThanOrEqual(expectedDuration * 0.8);
      expect(actualDuration).toBeLessThanOrEqual(expectedDuration * 1.2);
    });

    test('should handle multiple repairs sequentially', async () => {
      const customer1 = new Customer('Customer 1', 'Jaguar');
      const customer2 = new Customer('Customer 2', 'Leopard');
      
      const repair1 = technician.repairing(customer1);
      const repair2 = technician.repairing(customer2);
      
      const [record1, record2] = await Promise.all([repair1, repair2]);
      
      expect(record1.technician).toBe('Test Tech');
      expect(record2.technician).toBe('Test Tech');
      expect(record1.customer).toBe('Customer 1');
      expect(record2.customer).toBe('Customer 2');
    });
  });
});
