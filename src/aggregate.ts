import { Entity } from "./entity";
import { IDomainEvent } from "./event";

/**
 * Abstract base class for Aggregate Roots in Domain-Driven Design (DDD).
 *
 * @remarks
 * An Aggregate Root is a primary Entity that sits at the top of an aggregate boundary.
 * It encapsulates an entity cluster and enforces transactional consistency and business invariants.
 *
 * Aggregate Roots are responsible for recording Domain Events that occur during state transitions.
 * These events can be retrieved and dispatched to event handlers or message brokers when the aggregate
 * is persisted by a repository.
 *
 * @typeParam T - The type of properties encapsulated by the aggregate root.
 *
 * @example
 * ```ts
 * interface OrderProps {
 *   customerId: string;
 *   total: number;
 *   status: 'pending' | 'paid' | 'cancelled';
 * }
 *
 * class Order extends AggregateRoot<OrderProps> {
 *   public markAsPaid(): void {
 *     this.props.status = 'paid';
 *     this.addDomainEvent(new OrderPaidEvent(this.id, this.props.total));
 *   }
 * }
 *
 * const order = new Order({ customerId: 'cust_1', total: 100, status: 'pending' }, 'ord_123');
 * order.markAsPaid();
 *
 * // Inspect domain events
 * console.log(order.domainEvents.length); // 1
 *
 * // Clear events after publishing
 * order.clearEvents();
 * console.log(order.domainEvents.length); // 0
 * ```
 */
export abstract class AggregateRoot<T> extends Entity<T> {
  /**
   * Internal queue of uncommitted domain events recorded by this aggregate root.
   */
  private _domainEvents: IDomainEvent[] = [];

  /**
   * Gets the list of uncommitted domain events recorded by this aggregate root.
   *
   * @returns An array of recorded {@link IDomainEvent} instances.
   */
  get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  /**
   * Records a domain event to be dispatched after persistence.
   *
   * @remarks
   * Subclasses should call this method whenever a significant business event occurs
   * within the aggregate boundary.
   *
   * @param domainEvent - The domain event instance to record.
   *
   * @example
   * ```ts
   * this.addDomainEvent(new UserRegisteredEvent(this.id, this.props.email));
   * ```
   */
  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent);
    // Log for debugging/traceability
    console.log(`[Domain Event Created]: ${domainEvent.constructor.name}`);
  }

  /**
   * Clears all recorded domain events from the aggregate root.
   *
   * @remarks
   * This method is typically invoked by repositories or unit-of-work dispatchers
   * once all pending domain events have been successfully published.
   *
   * @example
   * ```ts
   * await eventBus.publishAll(aggregate.domainEvents);
   * aggregate.clearEvents();
   * ```
   */
  public clearEvents(): void {
    this._domainEvents = [];
  }
}
