# Maze Web Test Suite

This directory contains comprehensive tests for the maze-web application.

## Test Structure

### Unit Tests
- **Location**: `src/**/*.test.ts`
- **Purpose**: Test individual functions and components in isolation
- **Framework**: Vitest

### Integration Tests
- **Location**: `src/lib/gameplay/integration.test.ts`
- **Purpose**: Test how different modules work together
- **Framework**: Vitest

### Component Tests
- **Location**: `src/**/*.svelte.test.ts`
- **Purpose**: Test Svelte components with browser simulation
- **Framework**: Vitest + @vitest/browser

### End-to-End Tests
- **Location**: `tests/e2e.spec.ts`
- **Purpose**: Test complete user workflows
- **Framework**: Playwright (requires installation)

## Running Tests

### Unit and Component Tests
```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm run test:unit
```

### End-to-End Tests (requires Playwright setup)
```bash
# Install Playwright first
npm install -D @playwright/test
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### All Tests
```bash
npm run test:all
```

## Test Coverage

### Utility Functions (`src/lib/helper/util.test.ts`)
- ✅ `cn()` - Class name merging
- ✅ `getCellThemeColors()` - Cell styling by level
- ✅ `getThemeColors()` - Theme colors by level
- ✅ `levelToTheme()` - Theme mapping
- ✅ `calculatePlayerRating()` - Performance rating calculation

### HTTP Utilities (`src/lib/helper/run.test.ts`)
- ✅ `runPostRequest()` - POST request handling
- ✅ URL parameter replacement logic
- ✅ Error handling for network failures

### Maze Validation (`src/lib/gameplay/validation.test.ts`)
- ✅ `validateMaze()` - Maze structure validation
- ✅ `validateBounds()` - Coordinate boundary checking
- ✅ Edge cases (1x1 maze, rectangular mazes)

### API Services (`src/lib/api/maze.test.ts`)
- ✅ All MazeAPILive methods
- ✅ Parameter passing validation
- ✅ Error case handling

### Page Components (`src/routes/page.svelte.test.ts`)
- ✅ Logo and UI rendering
- ✅ Loading states
- ✅ Maze selection functionality
- ✅ Error handling
- ✅ Navigation behavior

## Test Configuration

### Vitest Configuration
- **Client tests**: Browser environment with Playwright
- **Server tests**: Node environment
- **Setup**: `vitest-setup-client.ts`

### Browser Test Setup
- **Provider**: Playwright
- **Browser**: Chromium
- **Environment**: Actual browser rendering

## Adding New Tests

### Unit Test Template
```typescript
import { describe, expect, it } from "vitest";
import { yourFunction } from "./your-module.js";

describe("YourModule", () => {
  describe("yourFunction", () => {
    it("should handle normal case", () => {
      expect(yourFunction("input")).toBe("expected");
    });

    it("should handle edge case", () => {
      expect(yourFunction(null)).toBe("default");
    });
  });
});
```

### Component Test Template
```typescript
import { page } from "@vitest/browser/context";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import YourComponent from "./YourComponent.svelte";

describe("YourComponent", () => {
  it("should render correctly", async () => {
    render(YourComponent, { props: { someProp: "value" } });
    
    const element = page.getByText("Expected Text");
    await expect.element(element).toBeInTheDocument();
  });
});
```

## Testing Best Practices

1. **Test Naming**: Use descriptive test names that explain the behavior
2. **Arrange-Act-Assert**: Structure tests clearly
3. **Mock External Dependencies**: Use `vi.mock()` for external modules
4. **Test Edge Cases**: Include null, undefined, empty, and boundary values
5. **Component Testing**: Test user interactions, not implementation details
6. **Coverage**: Aim for high coverage but focus on critical paths

## Continuous Integration

Tests are configured to run in CI with:
- Parallel execution disabled in CI
- Retry logic for flaky tests
- HTML reporting for results
- Trace collection on failures

## Debugging Tests

### Debug Individual Test
```bash
npx vitest run --reporter=verbose specific.test.ts
```

### Debug Browser Tests
```bash
npx vitest --browser --no-headless
```

### Debug E2E Tests
```bash
npx playwright test --debug
```

## Known Limitations

1. **Effect Testing**: Complex Effect-based code requires more sophisticated mocking
2. **Real API Testing**: Currently uses mocked responses
3. **Full Integration**: Some tests are placeholders pending full implementation
4. **Playwright Dependency**: E2E tests require additional setup

## Future Improvements

- [ ] Add visual regression testing
- [ ] Implement full Effect testing patterns
- [ ] Add performance testing
- [ ] Set up test data seeding
- [ ] Add accessibility testing automation
- [ ] Implement snapshot testing for components
