/**
 * Abstract base class for Value Objects in Domain-Driven Design (DDD).
 *
 * @remarks
 * Value Objects describe characteristics or concepts in the domain that have no conceptual identity.
 * They are defined entirely by the equality of their attribute values.
 *
 * Value Objects are immutable. When instantiated, their properties are deeply frozen (`Object.freeze`)
 * to prevent mutation. Any change to a value object produces a new instance.
 *
 * @typeParam T - The type of properties encapsulated by the value object.
 *
 * @example
 * ```ts
 * interface MoneyProps {
 *   amount: number;
 *   currency: string;
 * }
 *
 * class Money extends ValueObject<MoneyProps> {
 *   get amount(): number {
 *     return this.props.amount;
 *   }
 *
 *   get currency(): string {
 *     return this.props.currency;
 *   }
 *
 *   public add(other: Money): Money {
 *     if (this.currency !== other.currency) {
 *       throw new Error('Currency mismatch');
 *     }
 *     return new Money({ amount: this.amount + other.amount, currency: this.currency });
 *   }
 * }
 *
 * const price1 = new Money({ amount: 50, currency: 'USD' });
 * const price2 = new Money({ amount: 50, currency: 'USD' });
 * console.log(price1.equals(price2)); // true
 * ```
 */
export abstract class ValueObject<T> {
  /**
   * The immutable structural properties defining this value object.
   */
  protected readonly props: T;

  /**
   * Initializes a new instance of a `ValueObject`.
   *
   * @remarks
   * Freezes the supplied properties object to ensure immutability at runtime.
   *
   * @param props - The structural attributes defining the value object.
   */
  constructor(props: T) {
    // Deep freeze ensures immutability in JS/TS
    this.props = Object.freeze(props);
  }

  /**
   * Compares the current value object with another instance for structural equality.
   *
   * @remarks
   * Two value objects are considered equal if they are defined and their encapsulated
   * properties have matching JSON serializations.
   *
   * @param valueObject - The candidate value object to compare against this instance.
   * @returns `true` if the candidate is defined and structurally identical; otherwise `false`.
   *
   * @example
   * ```ts
   * const addr1 = new Address({ street: '123 Main St', city: 'Sydney' });
   * const addr2 = new Address({ street: '123 Main St', city: 'Sydney' });
   * console.log(addr1.equals(addr2)); // true
   * ```
   */
  public equals(valueObject?: ValueObject<T>): boolean {
    if (valueObject === null || valueObject === undefined) return false;
    if (valueObject.props === undefined) return false;

    return JSON.stringify(this.props) === JSON.stringify(valueObject.props);
  }
}
