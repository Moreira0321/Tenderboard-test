// Types for better type safety
type PhoneSeries = 'Jaguar' | 'Leopard' | 'Lion';
type TechnicianStatus = 'idle' | 'working';

interface RepairRecord {
  technician: string;
  customer: string;
  phoneSeries: PhoneSeries;
  startTime: Date;
  endTime: Date;
  duration: number;
}

export class Technician {
  private _name: string;
  private _averageRepairTime: number; // in seconds
  private _status: TechnicianStatus;
  private _currentCustomer: Customer | null;

  constructor(name: string, averageRepairTime: number) {
    this._name = name;
    this._averageRepairTime = averageRepairTime;
    this._status = 'idle';
    this._currentCustomer = null;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get name() {
    return this._name;
  }

  public set averageRepairTime(averageRepairTime: number) {
    this._averageRepairTime = averageRepairTime;
  }

  public get averageRepairTime() {
    return this._averageRepairTime;
  }

  public get status(): TechnicianStatus {
    return this._status;
  }

  public get currentCustomer(): Customer | null {
    return this._currentCustomer;
  }

  public async repairing(customer: Customer): Promise<RepairRecord> {
    this._status = 'working';
    this._currentCustomer = customer;
    const startTime = new Date();
    
    console.log(`🛠️  ${this._name} starts repairing ${customer.name}'s ${customer.phoneSeries} phone...`);
    
    return new Promise<RepairRecord>((resolve) => {
      setTimeout(() => {
        const endTime = new Date();
        const duration = (endTime.getTime() - startTime.getTime()) / 1000;
        
        console.log(`✅ ${this._name} finished repairing ${customer.name}'s ${customer.phoneSeries} phone (${duration.toFixed(1)}s)`);
        
        this._status = 'idle';
        this._currentCustomer = null;
        
        resolve({
          technician: this._name,
          customer: customer.name,
          phoneSeries: customer.phoneSeries,
          startTime,
          endTime,
          duration
        });
      }, this._averageRepairTime * 1000);
    });
  }

  public isAvailable(): boolean {
    return this._status === 'idle';
  }
}

export class Customer {
  private _name: string;
  private _phoneSeries: PhoneSeries;

  constructor(name: string, phoneSeries: PhoneSeries) {
    this._name = name;
    this._phoneSeries = phoneSeries;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get name() {
    return this._name;
  }

  public set phoneSeries(phoneSeries: PhoneSeries) {
    this._phoneSeries = phoneSeries;
  }

  public get phoneSeries() {
    return this._phoneSeries;
  }
}

export class ServiceCenter {
  private _name: string;
  private _address: string;
  private _technicians: Technician[];
  private _customers: Customer[];
  private _repairRecords: RepairRecord[];
  private _pendingRepairs: Promise<RepairRecord>[];

  constructor(name: string, address: string, technicians: Technician[], customers: Customer[]) {
    this._name = name;
    this._address = address;
    this._technicians = technicians;
    this._customers = customers;
    this._repairRecords = [];
    this._pendingRepairs = [];
  }

  public get name() {
    return this._name;
  }

  public get repairRecords(): RepairRecord[] {
    return [...this._repairRecords];
  }

  // Recursive function to process customers
  private async processCustomersRecursively(customerIndex: number): Promise<void> {
    if (customerIndex >= this._customers.length) {
      // All customers processed
      return;
    }

    // If no technicians available, skip processing
    if (this._technicians.length === 0) {
      return;
    }

    const customer = this._customers[customerIndex];
    const availableTechnician = this._technicians.find(tech => tech.isAvailable());

    if (availableTechnician) { 
      // Start repair immediately without waiting for completion
      const repairPromise = availableTechnician.repairing(customer);
      
      // Track pending repair
      this._pendingRepairs.push(repairPromise);
      
      // Handle repair completion
      repairPromise.then((repairRecord) => {
        this._repairRecords.push(repairRecord);

        if (this._pendingRepairs.length < this._customers.length) {
          console.log(`⏰ ${availableTechnician.name} available, call another customer...`);
        }
      });
      
      // Process next customer recursively immediately (don't wait for repair)
      await this.processCustomersRecursively(customerIndex + 1);
    } else {
      // Wait for any technician to become available
      await this.waitForAvailableTechnician();
      // Retry with same customer
      await this.processCustomersRecursively(customerIndex);
    }
  }

  private async waitForAvailableTechnician(): Promise<void> {
    return new Promise<void>((resolve) => {
      const checkInterval = setInterval(() => {
        const availableTechnician = this._technicians.find(tech => tech.isAvailable());
        if (availableTechnician) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100); // Check every 100ms
    });
  }

  public async startOperating(): Promise<void> {
    console.log(`🏢 ${this._name} at ${this._address} is now operating!`);
    console.log(`⏰ Service registration: 7:00 AM - 9:00 AM`);
    console.log(`🛠️  Technicians start working at 9:00 AM`);
    console.log(`📋 Total customers in queue: ${this._customers.length}`);
    console.log('='.repeat(60));
    
    const startTime = new Date();
    console.log(`🚀 Starting repairs at ${startTime.toLocaleTimeString()}`);
    console.log('');

    // Start processing customers recursively
    await this.processCustomersRecursively(0);

    // Wait for all pending repairs to complete
    if (this._pendingRepairs.length > 0) {
      await Promise.all(this._pendingRepairs);
    }

    const endTime = new Date();
    const totalDuration = (endTime.getTime() - startTime.getTime()) / 1000;
    
    console.log('');
    console.log('='.repeat(60));
    console.log(`🏁 All repairs completed at ${endTime.toLocaleTimeString()}`);
    console.log(`⏱️  Total operation time: ${totalDuration.toFixed(1)} seconds`);
    console.log('');
    
    this.printSummary();
  }

  private printSummary(): void {
    console.log('📊 DAILY REPAIR SUMMARY');
    console.log('='.repeat(60));
    
    this._repairRecords.forEach((record, index) => {
      console.log(`${index + 1}. ${record.technician} → ${record.customer} (${record.phoneSeries}) - ${record.duration.toFixed(1)}s`);
    });
    
    console.log('');
    console.log('📈 STATISTICS');
    console.log('='.repeat(60));
    
    const daltonRecords = this._repairRecords.filter(r => r.technician === 'Dalton');
    const wapolRecords = this._repairRecords.filter(r => r.technician === 'Wapol');
    
    console.log(`Dalton: ${daltonRecords.length} repairs, avg: ${(daltonRecords.reduce((sum, r) => sum + r.duration, 0) / daltonRecords.length || 0).toFixed(1)}s`);
    console.log(`Wapol: ${wapolRecords.length} repairs, avg: ${(wapolRecords.reduce((sum, r) => sum + r.duration, 0) / wapolRecords.length || 0).toFixed(1)}s`);
    
    const phoneSeriesCount = this._repairRecords.reduce((acc, record) => {
      acc[record.phoneSeries] = (acc[record.phoneSeries] || 0) + 1;
      return acc;
    }, {} as Record<PhoneSeries, number>);
    
    console.log('');
    console.log('📱 PHONE SERIES BREAKDOWN');
    console.log('='.repeat(60));
    Object.entries(phoneSeriesCount).forEach(([series, count]) => {
      console.log(`${series}: ${count} repairs`);
    });
  }
}

// Utility function to generate random phone series
export function generateRandomPhoneSeries(): PhoneSeries {
  const series: PhoneSeries[] = ['Jaguar', 'Leopard', 'Lion'];
  return series[Math.floor(Math.random() * series.length)];
}

// ====================================================================================
// MAIN - Only run when this file is executed directly, not when imported
// ====================================================================================

// Check if this file is being run directly (not imported for testing)
// Use a safer check that works in both Node.js and Jest environments
const isMainModule = typeof process !== 'undefined' && 
                    process.argv && 
                    process.argv[1] && 
                    process.argv[1].endsWith('main.ts');

if (isMainModule) {
  // Define Technicians (converted to seconds: Dalton 10min→15s, Wapol 20min→25s)
  const dalton = new Technician('Dalton', 15); // 15 seconds
  const wapol = new Technician('Wapol', 25); // 25 seconds
  const technicians = [dalton, wapol];

  // Generate 10 customers with random phone series
  const customers = new Array(10).fill(null).map((_, index) => {
    const phoneSeries = generateRandomPhoneSeries();
    return new Customer(`Customer ${index + 1}`, phoneSeries);
  });

  // Define Service Center
  const serviceCenter: ServiceCenter = new ServiceCenter('First Service Center', 'Long Ring Long Land Street', technicians, customers);

  console.log('📋 CUSTOMERS IN QUEUE:');
  console.table(customers.map(c => ({ Name: c.name, 'Phone Series': c.phoneSeries })));
  console.log('');

  // Begin Operating
  serviceCenter.startOperating().catch(err => console.log('❌ Error:', err));
}
