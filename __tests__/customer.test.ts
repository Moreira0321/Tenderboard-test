import { Customer } from '../main';

describe('Customer', () => {
  let customer: Customer;

  beforeEach(() => {
    customer = new Customer('Test Customer', 'Jaguar');
  });

  describe('Constructor', () => {
    test('should create a customer with correct initial values', () => {
      expect(customer.name).toBe('Test Customer');
      expect(customer.phoneSeries).toBe('Jaguar');
    });

    test('should create customer with different phone series', () => {
      const leopardCustomer = new Customer('Leopard Customer', 'Leopard');
      const lionCustomer = new Customer('Lion Customer', 'Lion');

      expect(leopardCustomer.phoneSeries).toBe('Leopard');
      expect(lionCustomer.phoneSeries).toBe('Lion');
    });
  });

  describe('Getters and Setters', () => {
    test('should set and get name correctly', () => {
      customer.name = 'New Customer Name';
      expect(customer.name).toBe('New Customer Name');
    });

    test('should set and get phoneSeries correctly', () => {
      customer.phoneSeries = 'Leopard';
      expect(customer.phoneSeries).toBe('Leopard');

      customer.phoneSeries = 'Lion';
      expect(customer.phoneSeries).toBe('Lion');

      customer.phoneSeries = 'Jaguar';
      expect(customer.phoneSeries).toBe('Jaguar');
    });

    test('should handle all valid phone series types', () => {
      const series: Array<'Jaguar' | 'Leopard' | 'Lion'> = ['Jaguar', 'Leopard', 'Lion'];
      
      series.forEach(phoneSeries => {
        customer.phoneSeries = phoneSeries;
        expect(customer.phoneSeries).toBe(phoneSeries);
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty name', () => {
      customer.name = '';
      expect(customer.name).toBe('');
    });

    test('should handle special characters in name', () => {
      customer.name = 'Customer-123!@#';
      expect(customer.name).toBe('Customer-123!@#');
    });

    test('should handle very long name', () => {
      const longName = 'A'.repeat(1000);
      customer.name = longName;
      expect(customer.name).toBe(longName);
    });
  });
});
