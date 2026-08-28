---
pageType: home

hero:
  name: "@banksia/domain-objects"
  text: Tactical Domain-Driven Design for TypeScript
  tagline: Enterprise-grade, type-safe, and zero-dependency building blocks for authoring expressive, invariant-protected domain models.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/introduction
    - theme: alt
      text: API Reference
      link: /api/
    - theme: alt
      text: GitHub
      link: https://github.com/Banksia-Corp/domain-objects

features:
  - title: Zero Runtime Dependencies
    details: Pure modern TypeScript relying strictly on native ECMAScript standards. Fully compatible with Node.js, Bun, Deno, and Cloudflare Workers.
    icon: ⚡
  - title: Tactical DDD Primitives
    details: First-class base classes for Entity, ValueObject, AggregateRoot, DomainEvent, and IRepository abstractions.
    icon: 🧱
  - title: Structural Immutability
    details: Deep runtime freezing with Object.freeze and deterministic, high-throughput structural equality for Value Objects.
    icon: 🔒
  - title: Transactional Consistency
    details: Aggregate Roots guard business invariants, enforce consistency boundaries, and buffer domain events for atomic side effects.
    icon: 🛡️
  - title: Audited High Performance
    details: Microbenchmark-verified performance characteristics with tiny package distribution sizes (<1.5 kB gzipped).
    icon: 🚀
  - title: Modern Tooling & Documentation
    details: Built with Rspack/Rslib and documented with Rspress and TypeDoc for instant full-text search and comprehensive symbol navigation.
    icon: 📚
---
