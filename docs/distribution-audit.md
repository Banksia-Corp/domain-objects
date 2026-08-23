# Build Distribution, Bundling Strategy & Packaging Audit

This document details build distribution, bundling strategies, packaging hygiene, and runtime compatibility standards for `@banksia/domain-objects`.

---

## 1. Executive Summary

`@banksia/domain-objects` is architected as an ultra-lightweight, zero-dependency suite of Domain-Driven Design primitives.

### Distribution Goals & Standards

1. **Packaging Hygiene**: Verified npm tarball packaging boundaries (`package.json#files`) and JSR publish scope (`jsr.json`), ensuring zero test files, internal scripts, or temporary caches leak into published packages.
2. **ESM & Modern Runtime Targets**: Built using [Rslib](https://rslib.rs/) (`@rslib/core`) targeting modern ESM environments (Node.js 18+, Bun, Deno, and browser/edge runtimes).
3. **Tree-Shaking Optimization**: `"sideEffects": false` in `package.json` guarantees dead-code elimination in consumer bundlers (Vite, Webpack, Rollup, Rspack, esbuild).
4. **Type Declaration Cleanliness**: Generated TypeScript `.d.ts` declaration files accurately reflect public API types with complete TypeDoc docstrings.

---

## 2. Packaging & Distribution Artifact Hygiene

### NPM Distribution Tarball (`pnpm pack --dry-run`)

The published npm package strictly includes only distribution assets:

```
📦 @banksia/domain-objects@0.0.1
Tarball Contents:
  ├── dist/
  │   ├── index.js
  │   └── src/
  │       ├── aggregate.d.ts
  │       ├── entity.d.ts
  │       ├── event.d.ts
  │       ├── index.d.ts
  │       ├── repository.d.ts
  │       └── value-object.d.ts
  ├── package.json
  └── README.md
```

- **Zero Leakage**: No `.ts` source files, `tests/`, `docs/`, `scripts/`, or internal tooling artifacts leak into published packages.
- **Verification Diagnostics**: Packages should periodically be audited with `publint` and `attw` (`@arethetypeswrong/cli`) to verify module resolution compatibility across Node16, NodeNext, and Bundler strategies.

---

## 3. JSR Manifest Configuration (`jsr.json`)

Explicit publish rules are configured in `jsr.json`:

```json
{
  "name": "@banksia/domain-objects",
  "version": "0.0.1",
  "exports": "./src/index.ts"
}
```

JSR consumes TypeScript source directly from `src/index.ts`, while npm consumes compiled ESM and DTS from `dist/`.
