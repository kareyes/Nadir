# Maze DB Test Scripts

This directory contains test scripts for the maze-db package initialization and functionality.

## Available Test Scripts

### 1. Unit Tests (`initialization.test.ts`)
Comprehensive vitest-based unit tests that validate:
- Maze schema initialization
- Player schema initialization  
- CRUD operations for mazes and players
- Data retrieval and validation

**Run with:**
```bash
# Run all tests
pnpm test

# Run tests once (no watch mode)
pnpm test:run
```

### 2. Manual Initialization Test (`init-test.ts`)
A standalone script that provides visual feedback while testing:
- Database service initialization
- Basic CRUD operations
- Full system integration test

**Run with:**
```bash
pnpm test:init
```

## Test Features

- ✅ Schema initialization validation
- ✅ Data insertion and retrieval
- ✅ Error handling verification
- ✅ Service integration testing
- ✅ Visual progress feedback (init-test.ts)

## Dependencies

The test scripts use:
- `vitest` for unit testing framework
- `tsx` for running TypeScript files directly
- `@effect/vitest` for Effect-specific testing utilities

## Usage Examples

### Running Quick Initialization Test
```bash
cd packages/maze-db
pnpm test:init
```

### Running Full Test Suite
```bash
cd packages/maze-db
pnpm test
```

### Running Specific Test File
```bash
cd packages/maze-db
pnpm vitest src/test/initialization.test.ts
```
