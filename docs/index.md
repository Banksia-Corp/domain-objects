---
pageType: home

hero:
  name: "@banksia/domain-objects"
  text: Domain-Driven Design for TypeScript
  tagline: Ultra-lightweight, zero-dependency building blocks for authoring expressive, invariant-protected domain models.
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
    details: Relies strictly on native ECMAScript. Compatible with Node.js, Deno, Bun, Cloudflare Workers, and modern browsers.
    icon: ⚡
  - title: Domain Modeling Primitives
    details: First-class base classes for Values, Entities, Aggregates, Domain Events, and Repositories.
    icon: 🧱
  - title: Guaranteed Immutability
    details: Deep runtime freezing and deterministic structural equality for Value Objects without boilerplate.
    icon: 🔒
  - title: Clear Boundaries & Ownership
    details: Aggregate Roots guard business invariants, coordinate related objects, and buffer domain events.
    icon: 🛡️
  - title: Fast, Mock-Free Testing
    details: Pure in-memory domain models with zero external I/O allow complete test suites to run in milliseconds.
    icon: 🚀
  - title: Ultra-Lightweight Footprint
    details: ~238 B compressed, under 1.5 kB gzipped.
    icon: 📦
---
