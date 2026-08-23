# AGENTS.md

You are working on `@banksia/domain-objects`, an enterprise-grade Domain-Driven Design (DDD) primitives and building blocks library for TypeScript.

## Documentation Index & Dedicated Guides

For in-depth guides, architectural principles, and policies, refer to the dedicated documentation:

- **[Semantic Versioning & Changeset Workflow](./docs/versioning-and-changesets.md)**: Rules for when changesets are required, SemVer bump classifications (`major`, `minor`, `patch`), and release automation.
- **[Development & Contributor Guidelines](./docs/development-guidelines.md)**: Zero-dependency core principles, immutability guarantees, structural vs. identity equality, aggregate boundaries, and quality gate workflows.
- **[Build Distribution & Packaging Audit](./docs/distribution-audit.md)**: Artifact packaging hygiene, Rslib bundling evaluation, tree-shaking characteristics, and runtime compatibility.
- **[Performance Benchmarks & Budgets](./docs/benchmarks.md)**: Structural comparison throughput, aggregate event handling efficiency, and package distribution size budgets.

---

## Essential Commands

- `pnpm run build` - Build package via Rslib
- `pnpm run dev` - Build in watch mode
- `pnpm run docs` - Generate API documentation via TypeDoc
- `pnpm run docs:watch` - Generate API documentation in watch mode
- `pnpm run test` - Run Vitest test suite
- `pnpm run lint` - Check formatting and code style with Prettier
- `pnpm run format` - Format code with Prettier
- `pnpm run release` - Build and publish package via Changesets
