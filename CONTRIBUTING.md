# Contributing to chartscii-cli

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

### Getting Started

```bash
# Clone the repository
git clone https://github.com/tool3/chartscii-cli
cd chartscii-cli

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Watch mode for development
npm run dev
```

## Project Structure

```
src/
├── cli.ts          # CLI entry point and argument parsing
├── generator.ts    # Chart generation orchestration
├── parser.ts       # Input format parsing (JSON, CSV, text)
├── reader.ts       # Input source reading (stdin, files, args)
├── config.ts       # Configuration building and defaults
├── types.ts        # TypeScript type definitions
├── *.test.ts       # Colocated test files
```

### Key Principles

1. **Lowercase, single-word filenames** - Keep it simple
2. **Colocated tests** - Tests live next to source files
3. **Functional style** - Prefer pure functions over classes
4. **TypeScript strict mode** - Full type safety

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Keep changes focused and atomic

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Build and test CLI manually
npm run build
node dist/cli.js 1 2 3 4 5
```

### 4. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git commit -m "feat: add support for TSV files"
git commit -m "fix: handle empty CSV files gracefully"
git commit -m "docs: improve README examples"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use functional programming patterns
- Avoid classes unless necessary
- Use descriptive variable names

### Testing

- Write tests for all new features
- Test edge cases and error conditions
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert

### Example Test

```typescript
describe('parser', () => {
  describe('parseCSV', () => {
    it('should parse label,value pairs', () => {
      // Arrange
      const csv = 'Label A,10\nLabel B,20';

      // Act
      const result = parser.parseCSV(csv);

      // Assert
      expect(result).to.deep.equal([
        { label: 'Label A', value: 10 },
        { label: 'Label B', value: 20 }
      ]);
    });
  });
});
```

## Adding New Features

### 1. Discuss First

For major features, open an issue first to discuss:
- Is it in scope for the project?
- How should it work?
- What's the API?

### 2. Implementation Checklist

- [ ] Feature implemented and working
- [ ] Tests added and passing
- [ ] Documentation updated (README, examples)
- [ ] TypeScript types properly defined
- [ ] Error handling in place
- [ ] Edge cases considered

### 3. Documentation

Update relevant documentation:
- README.md - Usage examples
- MIGRATION.md - If breaking changes
- JSDoc comments - For functions

## Reporting Bugs

### Before Reporting

1. Check existing issues
2. Test with latest version
3. Verify it's not a configuration issue

### Bug Report Should Include

- chartscii-cli version
- Node.js version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Sample data (if applicable)

## Feature Requests

We welcome feature requests! Please include:
- Use case description
- Proposed API/usage
- Example input/output
- Why it's useful

## Testing

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# With coverage (if configured)
npm run test:coverage
```

### Writing Tests

Tests should:
- Be fast (< 100ms each)
- Be independent (no shared state)
- Test one thing (single responsibility)
- Have descriptive names

## Release Process

Maintainers only:

1. Update version in package.json
2. Update CHANGELOG.md
3. Create git tag
4. Push to GitHub
5. Create GitHub release
6. GitHub Actions will publish to npm

## Questions?

- 💬 [GitHub Discussions](https://github.com/tool3/chartscii-cli/discussions)
- 🐛 [Issues](https://github.com/tool3/chartscii-cli/issues)
- 📧 Email: [maintainer email]

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
