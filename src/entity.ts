/**
 * Abstract base class for Domain Entities in Domain-Driven Design (DDD).
 *
 * @remarks
 * Entities are domain objects defined not by their attributes, but by a unique identity (`_id`)
 * and continuous thread of state throughout their lifecycle. Two entities with different property
 * values are still considered identical if their unique identifier matches.
 *
 * @typeParam T - The type of properties encapsulated by the entity.
 *
 * @example
 * ```ts
 * interface UserProps {
 *   name: string;
 *   email: string;
 * }
 *
 * class User extends Entity<UserProps> {
 *   public updateEmail(newEmail: string): void {
 *     this.props.email = newEmail;
 *   }
 * }
 *
 * const user1 = new User({ name: 'Alice', email: 'alice@example.com' }, 'usr_123');
 * const user2 = new User({ name: 'Alice Smith', email: 'alice.smith@example.com' }, 'usr_123');
 *
 * console.log(user1.equals(user2)); // true (same identity 'usr_123')
 * ```
 */
export abstract class Entity<T> {
  /**
   * The unique identifier representing the entity's identity.
   */
  protected readonly _id: string;

  /**
   * The encapsulated state and properties of the entity.
   */
  public props: T;

  /**
   * Initializes a new instance of an `Entity`.
   *
   * @param props - The domain properties and attributes of the entity.
   * @param id - The unique identifier that distinguishes this entity across its lifecycle.
   */
  constructor(props: T, id: string) {
    this._id = id;
    this.props = props;
  }

  /**
   * Gets the unique identifier of the entity.
   *
   * @returns The unique string identifier of this entity.
   */
  get id(): string {
    return this._id;
  }

  /**
   * Compares the current entity with another entity instance for identity equality.
   *
   * @remarks
   * In Domain-Driven Design, entities are compared strictly by their unique identity (`_id`)
   * rather than their internal properties.
   *
   * @param object - The candidate entity to compare against this instance.
   * @returns `true` if the candidate is an entity with the same `_id`; otherwise `false`.
   *
   * @example
   * ```ts
   * const entity1 = new User({ name: 'Alice' }, 'id-1');
   * const entity2 = new User({ name: 'Bob' }, 'id-1');
   * entity1.equals(entity2); // true
   * ```
   */
  public equals(object?: Entity<T>): boolean {
    if (object === null || object === undefined) return false;
    if (this === object) return true;

    return this._id === object._id;
  }
}
