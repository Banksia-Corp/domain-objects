# Performance Benchmarks & Budgets

This document outlines runtime performance goals, benchmarking methodologies, and build size budgets for `@banksia/domain-objects`.

---

## 1. Overview & Objectives

Domain objects operate at the innermost core of domain logic and are instantiated and compared frequently in hot code paths. Maintaining near-zero execution overhead and minimal memory allocations are core architectural requirements.

Key areas monitored include:

- **Value Object Structural Comparison**: Throughput and latency of `ValueObject.equals()` across nested properties, primitive attributes, and collections.
- **Entity & Aggregate Identity Verification**: Throughput of `Entity.equals()` and instance identity checks.
- **Aggregate Root Event Lifecycle**: Latency of `record()`, `pullEvents()`, and event array allocations during business transaction cycles.
- **Bundle & Distribution Size Budgets**: Ensuring compiled artifacts remain well within compression targets.

---

## 2. Size & Performance Budgets

| Metric / Asset                        | Target Budget          | Baseline Measured (v0.0.1) | Notes                               |
| :------------------------------------ | :--------------------- | :------------------------- | :---------------------------------- |
| **`dist/index.js` (Raw Size)**        | `< 2.5 KB`             | `1.04 KB`                  | Core compiled ESM output            |
| **`dist/index.js` (Gzip / Brotli)**   | `< 1.0 KB`             | `238 B`                    | Compressed network payload          |
| **`ValueObject.equals()` Throughput** | `> 1,000,000 ops/sec`  | `~4.7M ops/sec` (simple)   | Structural equality comparison      |
| **`Entity.equals()` Throughput**      | `> 15,000,000 ops/sec` | `~27.1M ops/sec`           | Identity comparison                 |
| **Aggregate Event Recording/Pulling** | `< 0.001 ms / event`   | `~0.0001 ms / event`       | In-memory event queuing & lifecycle |

---

## 3. Benchmark Suites

The runtime microbenchmark suite is organized under `tests/benchmarks/`:

- **`value-object.bench.ts`**: Evaluates `ValueObject.equals()` across simple and nested object structures, deep freezing, and instantiation costs.
- **`entity.bench.ts`**: Evaluates `Entity.equals()` identity checks (same identity, different identity, same instance, null/undefined checks) and instantiation.
- **`aggregate.bench.ts`**: Evaluates `AggregateRoot` domain event lifecycle, recording, extraction via `domainEvents`, and clearing via `clearEvents()`.

---

## 4. Running Benchmarks

Execute the Vitest benchmark suite:

```bash
pnpm run bench
```

To run a single execution without watch mode:

```bash
pnpm run bench --run
```
