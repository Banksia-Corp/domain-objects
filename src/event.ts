/**
 * Interface representing a Domain Event in Domain-Driven Design (DDD).
 *
 * @remarks
 * Domain Events capture state changes or business-significant occurrences within an Aggregate Root.
 * They represent immutable records of something that happened in the past and are used for
 * asynchronous inter-aggregate communication, event sourcing, or integration messaging.
 *
 * @example
 * ```ts
 * class OrderPlacedEvent implements IDomainEvent {
 *   public readonly dateTimeOccurred: Date;
 *   public readonly orderId: string;
 *   public readonly customerId: string;
 *   public readonly total: number;
 *
 *   constructor(orderId: string, customerId: string, total: number) {
 *     this.dateTimeOccurred = new Date();
 *     this.orderId = orderId;
 *     this.customerId = customerId;
 *     this.total = total;
 *   }
 *
 *   public getAggregateId(): string {
 *     return this.orderId;
 *   }
 * }
 * ```
 */
export interface IDomainEvent {
  /**
   * The date and time when the domain event occurred.
   */
  dateTimeOccurred: Date;

  /**
   * Retrieves the unique identifier of the aggregate root that originated this event.
   *
   * @returns The string identifier of the originating aggregate root.
   */
  getAggregateId(): string;
}
