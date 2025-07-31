#!/bin/bash

# Maze Web Test Runner Script
# Usage: ./run-tests.sh [test-type]
# Test types: unit, component, e2e, all, coverage, watch

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${BLUE}================================${NC}"
    echo -e "${BLUE}   Maze Web Test Runner${NC}"
    echo -e "${BLUE}================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_dependencies() {
    print_info "Checking dependencies..."
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the right directory?"
        exit 1
    fi
    
    print_success "Dependencies check passed"
}

run_unit_tests() {
    print_info "Running unit tests..."
    npm run test:unit -- --run
    print_success "Unit tests completed"
}

run_component_tests() {
    print_info "Running component tests..."
    npm run test:unit -- --run --reporter=verbose
    print_success "Component tests completed"
}

run_e2e_tests() {
    print_info "Checking for Playwright installation..."
    
    if ! npm list @playwright/test > /dev/null 2>&1; then
        print_warning "Playwright not found. Installing..."
        npm install -D @playwright/test
        npx playwright install
    fi
    
    print_info "Running E2E tests..."
    npm run test:e2e
    print_success "E2E tests completed"
}

run_coverage() {
    print_info "Running tests with coverage..."
    npm run test:coverage
    print_success "Coverage report generated"
}

run_watch() {
    print_info "Starting tests in watch mode..."
    npm run test:watch
}

run_all_tests() {
    print_info "Running all tests..."
    
    print_info "Step 1/3: Unit and Component tests"
    run_unit_tests
    
    print_info "Step 2/3: Coverage report"
    run_coverage
    
    print_info "Step 3/3: E2E tests (if Playwright is available)"
    if npm list @playwright/test > /dev/null 2>&1; then
        run_e2e_tests
    else
        print_warning "Skipping E2E tests - Playwright not installed"
        print_info "To install: npm install -D @playwright/test && npx playwright install"
    fi
    
    print_success "All tests completed successfully!"
}

lint_and_type_check() {
    print_info "Running lint and type checks..."
    npm run check
    print_success "Lint and type checks passed"
}

show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  unit        Run unit tests only"
    echo "  component   Run component tests with verbose output"
    echo "  e2e         Run end-to-end tests (installs Playwright if needed)"
    echo "  coverage    Run tests with coverage report"
    echo "  watch       Run tests in watch mode"
    echo "  all         Run all tests (default)"
    echo "  check       Run lint and type checks"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0              # Run all tests"
    echo "  $0 unit         # Run only unit tests"
    echo "  $0 watch        # Start watch mode"
    echo "  $0 coverage     # Generate coverage report"
}

main() {
    print_header
    check_dependencies
    
    case "${1:-all}" in
        "unit")
            run_unit_tests
            ;;
        "component")
            run_component_tests
            ;;
        "e2e")
            run_e2e_tests
            ;;
        "coverage")
            run_coverage
            ;;
        "watch")
            run_watch
            ;;
        "all")
            run_all_tests
            ;;
        "check")
            lint_and_type_check
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
