# Setup Guide for Phonetic Service Center Simulation

## Prerequisites

This project requires Node.js and npm/yarn to run. If you don't have them installed:

### Installing Node.js

1. **Download Node.js**: Visit [https://nodejs.org/](https://nodejs.org/) and download the LTS version
2. **Install Node.js**: Run the installer and follow the setup wizard
3. **Verify Installation**: Open a new terminal/command prompt and run:
   ```bash
   node --version
   npm --version
   ```

### Alternative: Using Chocolatey (Windows)
```bash
choco install nodejs
```

### Alternative: Using Homebrew (macOS)
```bash
brew install node
```

## Project Setup

1. **Install Dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Build the Project**:
   ```bash
   npm run build
   # or
   yarn build
   ```

3. **Run the Application**:
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run Tests**:
   ```bash
   npm test
   # or
   yarn test
   ```

## Project Structure

- `main.ts` - Main application file with the service center simulation
- `__tests__/main.test.ts` - Unit tests for all classes and functions
- `package.json` - Project configuration and dependencies
- `tsconfig.json` - TypeScript configuration
- `jest.config.js` - Jest testing configuration

## Features Implemented

✅ **CLI Application**: Can be run with `npm start` or `yarn start`

✅ **Time Simulation**: 
- Dalton: 10 minutes → 15 seconds
- Wapol: 20 minutes → 25 seconds

✅ **10 Customers**: Each with random phone series (Jaguar, Leopard, Lion)

✅ **Process Transition**: All repair processes are printed to terminal

✅ **Daily Summary**: Complete summary of all repairs at the end

✅ **Available Code Usage**: Uses and modifies the provided classes

✅ **Recursion**: Uses recursive function `processCustomersRecursively()`

✅ **Unit Tests**: Comprehensive tests for all functions and classes

✅ **TypeScript**: Full type safety with proper TypeScript types

## Expected Output

The application will:
1. Display the customer queue with their phone series
2. Show real-time repair progress for Dalton and Wapol
3. Print completion messages for each repair
4. Display a comprehensive daily summary with statistics

## Testing

The test suite covers:
- Customer class functionality
- Technician class functionality  
- ServiceCenter class functionality
- Random phone series generation
- Complete simulation workflow
- Concurrent technician operations

Run tests with: `npm test` or `yarn test`
