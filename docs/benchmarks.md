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

| Metric / Asset                        | Target Budget          | Notes                                 |
| :------------------------------------ | :--------------------- | :------------------------------------ |
| **`dist/index.js` (Raw Size)**        | `< 2.5 KB`             | Core compiled ESM output              |
| **`dist/index.js` (Gzip / Brotli)**   | `< 1.0 KB`             | Compressed network payload            |
| **`ValueObject.equals()` Throughput** | `> 5,000,000 ops/sec`  | Shallow/medium structural comparisons |
| **`Entity.equals()` Throughput**      | `> 15,000,000 ops/sec` | Identity comparison                   |
| **Event Recording & Extraction**      | `< 0.001 ms / event`   | Lightweight in-memory event queuing   |

---

## 3. Running Benchmarks

When benchmark suites are executed via Vitest Bench:

```bash
pnpm run bench
```
