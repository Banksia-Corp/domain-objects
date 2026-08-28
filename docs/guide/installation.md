# Installation

Install `@banksia/domain-objects` using your package manager of choice:

## Package Managers

### pnpm

```bash
pnpm add @banksia/domain-objects
```

### npm

```bash
npm install @banksia/domain-objects
```

### yarn

```bash
yarn add @banksia/domain-objects
```

### bun

```bash
bun add @banksia/domain-objects
```

### JSR

```bash
npx jsr add @banksia/domain-objects
```

---

## Monorepo Workspace Usage

If you are using a monorepo setup (such as pnpm workspaces, Turborepo, or Nx), reference the package directly in your workspace `package.json`:

```json
{
  "dependencies": {
    "@banksia/domain-objects": "workspace:*"
  }
}
```

---

## Runtime Compatibility

`@banksia/domain-objects` has **zero external runtime dependencies** and relies exclusively on standard ECMAScript features. It runs seamlessly across all modern JavaScript runtimes:

- **Node.js**: `>= 22.0.0`
- **Cloudflare Workers**: Full support (V8 isolates)
- **Bun**: `>= 1.0`
- **Deno**: `>= 1.40`
- **Browser**: Modern evergreen browsers (ES2022+)

---

## Importing Primitives

Import the core primitives in your TypeScript files:

```ts
import {
  Entity,
  ValueObject,
  AggregateRoot,
  type IDomainEvent,
  type IRepository,
} from "@banksia/domain-objects";
```
