/**
 * Generic repository interface for managing the persistence lifecycle of Aggregate Roots.
 *
 * @remarks
 * In Domain-Driven Design, Repositories provide a collection-like abstraction for accessing
 * and persisting Aggregate Roots. They decouple the domain layer from persistence concerns
 * and database technologies (such as Cloudflare D1, PostgreSQL, or in-memory stores).
 *
 * @typeParam T - The type of Aggregate Root managed by this repository.
 *
 * @example
 * ```ts
 * class InMemoryUserRepository implements IRepository<User> {
 *   private storage = new Map<string, User>();
 *
 *   public async save(aggregate: User): Promise<void> {
 *     this.storage.set(aggregate.id, aggregate);
 *   }
 *
 *   public async findById(id: string): Promise<User | null> {
 *     return this.storage.get(id) ?? null;
 *   }
 *
 *   public async findAll(): Promise<User[]> {
 *     return Array.from(this.storage.values());
 *   }
 *
 *   public async update(aggregate: User): Promise<void> {
 *     this.storage.set(aggregate.id, aggregate);
 *   }
 *
 *   public async delete(id: string): Promise<void> {
 *     this.storage.delete(id);
 *   }
 * }
 * ```
 */
export interface IRepository<T> {
  /**
   * Persists a new aggregate root in the repository.
   *
   * @param aggregate - The aggregate root instance to persist.
   * @returns A promise that resolves when the save operation completes.
   */
  save(aggregate: T): Promise<void>;

  /**
   * Finds an aggregate root by its unique identifier.
   *
   * @param id - The unique identifier of the aggregate root.
   * @returns A promise that resolves to the aggregate root if found, or `null` otherwise.
   */
  findById(id: string): Promise<T | null>;

  /**
   * Retrieves all aggregate roots stored in the repository.
   *
   * @returns A promise that resolves to an array of all stored aggregate roots.
   */
  findAll(): Promise<T[]>;

  /**
   * Updates an existing aggregate root in the repository.
   *
   * @param aggregate - The aggregate root instance containing updated state.
   * @returns A promise that resolves when the update operation completes.
   */
  update(aggregate: T): Promise<void>;

  /**
   * Deletes an aggregate root from the repository by its unique identifier.
   *
   * @param id - The unique identifier of the aggregate root to delete.
   * @returns A promise that resolves when the delete operation completes.
   */
  delete(id: string): Promise<void>;
}
