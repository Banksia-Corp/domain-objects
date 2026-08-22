/**
 * Core Domain-Driven Design (DDD) building blocks for TypeScript backend applications.
 *
 * @remarks
 * This package provides foundational abstractions and base classes for authoring rich,
 * type-safe domain models following Domain-Driven Design principles:
 *
 * - {@link Entity}: Base class for objects defined by a unique identity and lifecycle.
 * - {@link AggregateRoot}: Entity serving as an entry point for an aggregate boundary, managing domain events.
 * - {@link ValueObject}: Base class for immutable objects defined solely by their property values.
 * - {@link IDomainEvent}: Interface for events capturing domain state transitions.
 * - {@link IRepository}: Generic repository interface for aggregate root persistence.
 *
 * @example
 * ```ts
 * import { AggregateRoot, ValueObject, IDomainEvent, IRepository } from 'domain-objects';
 * ```
 *
 * @packageDocumentation
 */

export * from "./entity";
export * from "./value-object";
export * from "./aggregate";
export * from "./event";
export * from "./repository";
