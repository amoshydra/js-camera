# AGENTS.md - Developer Guide for js-camera

## Project Overview

A QR code scanner web application built with React 19, TypeScript, Vite, and Panda CSS. Uses the native BarcodeDetector API with a fallback to @undecaf/zbar-wasm for barcode scanning.

## Build Commands

```bash
# Development
pnpm dev              # Start Vite dev server

# Build
pnpm build            # Full build: panda codegen → cssgen → tsc → vite build
pnpm codegen          # Generate Panda CSS artifacts
pnpm cssgen           # Generate CSS files

# Testing
pnpm test             # Run tests in watch mode
pnpm test:run         # Run tests once (CI/pre-commit)
pnpm test:ui          # Open Vitest UI

# Run a single test file or test case:
pnpm vitest run src/lib/barcodeScanner.test.ts
pnpm vitest run -t "returns true when BarcodeDetector"
```

## Lint & Format Commands

```bash
pnpm lint            # Run oxlint (React, React-Hooks, TypeScript)
pnpm lint:fix        # Fix lint issues automatically
pnpm fmt             # Check formatting (oxfmt)
pnpm fmt:fix         # Fix formatting issues
```

Pre-commit hooks run `lint:fix` and `fmt:fix` automatically via lefthook.

## Code Style Guidelines

### TypeScript

- Uses TypeScript with relaxed strict mode (`strict: false` in tsconfig.app.json)
- Path aliases: `@/*` maps to `src/*`, `~styled-system/*` maps to `styled-system/*`
- Target: ES2020, Module: ESNext
- No unused variable checks enforced in lint (only warnings)

### Formatting (oxfmt)

- **Single quotes** for strings
- **Single attribute per line** in JSX
- Run `pnpm fmt:fix` before committing

### Linting (oxlint)

Configured in `.oxlintrc.json`:

- `no-console`: warn
- `no-debugger`: warn
- `react/jsx-uses-react`: error
- `react/prop-types`: off
- `react-hooks/rules-of-use`: error
- `react-hooks/exhaustive-deps`: warn
- `typescript/no-unused-vars`: warn (args starting with `_` ignored)
- `typescript/no-undef`: off

### Imports

- Use path aliases: `import { something } from '@/lib/barcodeScanner'`
- React imports: Named imports from 'react' (e.g., `useState`, `useEffect`)
- CSS: Use Panda CSS utility classes instead of writing custom CSS

### Naming Conventions

- **Files**: camelCase for utilities/hooks (e.g., `useShareHandler.ts`, `barcodeScanner.ts`), PascalCase for components (e.g., `ScannedIndicator.tsx`)
- **Functions**: camelCase (e.g., `detectQRCodes`, `isBarcodeDetectorSupported`)
- **Types/Interfaces**: PascalCase (e.g., `DetectedBarcode`, `QrReaderData`)
- **Enums**: PascalCase with PascalCase members (e.g., `ErrorCode.BARCODE_DETECTOR_NOT_SUPPORTED`)
- **Components**: PascalCase, export as named export

### React Patterns

- Use functional components with hooks
- Prefer `useEffect` with cleanup for side effects
- Use `useState` for local component state
- Extract reusable logic into custom hooks (place in `src/hooks/`)
- Follow React 19 patterns (no explicit React import needed for JSX)

### Error Handling

- Use the custom `AppError` class for application errors
- Define error codes in `ErrorCode` enum in `src/lib/errors.ts`
- Structure: `new AppError(message, code, recommendation?)`
- Example:
  ```typescript
  throw new AppError(
    'BarcodeDetector is not supported',
    ErrorCode.BARCODE_DETECTOR_NOT_SUPPORTED,
    'Please use Chrome 83+ or Edge 83+',
  );
  ```

### Testing

- Test files: `*.test.ts` or `*.test.tsx` in `src/`
- Use Vitest with jsdom environment
- Import from 'vitest' (globals available via config)
- Test patterns:

  ```typescript
  import { afterEach, describe, expect, it, vi } from 'vitest';

  describe('barcodeScanner', () => {
    afterEach(() => {
      vi.resetModules();
      vi.unstubAllGlobals();
    });

    it('should detect barcodes', async () => {
      // test implementation
    });
  });
  ```

- Use `vi.fn()` for mocks, `vi.stubAllGlobals()`/`vi.unstubAllGlobals()` for globals

### Panda CSS

- Utility-first CSS via Panda CSS
- Run `pnpm codegen` after adding new components/pages
- Run `pnpm cssgen` before build
- Custom theme extends in `panda.config.ts`
- **When creating components, leverage design tokens (colors, spacing, typography, etc.) as much as possible** instead of hardcoding values

### File Organization

```
src/
├── components/       # React components
│   └── ComponentName/
│       ├── ComponentName.tsx
│       └── ComponentName.test.tsx
├── hooks/           # Custom React hooks
├── lib/             # Utilities, libraries, business logic
│   ├── errors.ts    # Error handling
│   └── *.ts         # Other utilities
├── test/            # Test setup files
│   └── setup.ts
└── App.tsx          # Main app component
```

### Git Workflow

1. Create feature branch from main
2. Make changes following code style
3. Run `pnpm lint:fix && pnpm fmt:fix` before commit
4. Run `pnpm test:run` to ensure tests pass
5. Commit with descriptive message

### Key Dependencies

- React 19.2.4
- TypeScript ~5.9.3
- Vite 8.0.0-beta.16
- Vitest 4.0.18
- Panda CSS 1.8.2
- oxlint 1.51.0 / oxfmt 0.36.0
- @undecaf/zbar-wasm (fallback barcode scanner)
