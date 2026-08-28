# Repository Pattern & Persistence Decoupling

The **Repository Pattern** mediates between the domain model and data mapping layers. It provides a collection-oriented interface for accessing, querying, and storing Aggregate Roots while completely isolating domain rules from database concerns.

---

## The `IRepository<T>` Contract

`@banksia/domain-objects` provides the generic repository interface:

```ts
export interface IRepository<T> {
  save(aggregate: T): Promise<void>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(aggregate: T): Promise<void>;
  delete(id: string): Promise<void>;
}
```

- **Persistence Ignorance**: The domain layer defines only the interface. Concrete implementations live in the infrastructure layer.
- **Aggregate Boundary Enforced**: Repositories only load and persist **Aggregate Roots**. Child entities and value objects are persisted through their root.

---

## In-Memory Repository Implementation (Testing)

For blazing-fast unit tests with zero database dependencies, write a lightweight in-memory repository:

```ts
import type { IRepository } from "@banksia/domain-objects";
import { User } from "./user";

export class InMemoryUserRepository implements IRepository<User> {
  private readonly items = new Map<string, User>();

  public async save(aggregate: User): Promise<void> {
    this.items.set(aggregate.id, aggregate);
  }

  public async findById(id: string): Promise<User | null> {
    return this.items.get(id) ?? null;
  }

  public async findAll(): Promise<User[]> {
    return Array.from(this.items.values());
  }

  public async update(aggregate: User): Promise<void> {
    this.items.set(aggregate.id, aggregate);
  }

  public async delete(id: string): Promise<void> {
    this.items.delete(id);
  }
}
```

---

## Production Persistence: Cloudflare D1 / SQL

In production infrastructure, concrete implementations map relational rows or JSON documents to rich domain aggregates:

```ts
import type { IRepository } from "@banksia/domain-objects";
import { Order, OrderItem, Money } from "./order";

export class D1OrderRepository implements IRepository<Order> {
  constructor(private readonly db: D1Database) {}

  public async findById(id: string): Promise<Order | null> {
    const row = await this.db
      .prepare(
        "SELECT id, customer_id, items_json, status FROM orders WHERE id = ?",
      )
      .bind(id)
      .first<{
        id: string;
        customer_id: string;
        items_json: string;
        status: string;
      }>();

    if (!row) return null;

    const rawItems = JSON.parse(row.items_json) as Array<{
      id: string;
      name: string;
      amount: number;
      currency: string;
      quantity: number;
    }>;

    const items = rawItems.map(
      (i) =>
        new OrderItem(
          {
            name: i.name,
            unitPrice: new Money({ amount: i.amount, currency: i.currency }),
            quantity: i.quantity,
          },
          i.id,
        ),
    );

    return new Order(
      {
        customerId: row.customer_id,
        items,
        status: row.status as any,
      },
      row.id,
    );
  }

  public async save(order: Order): Promise<void> {
    const itemsJson = JSON.stringify(
      order.props.items.map((i) => ({
        id: i.id,
        name: i.props.name,
        amount: i.props.unitPrice.amount,
        currency: i.props.unitPrice.currency,
        quantity: i.props.quantity,
      })),
    );

    await this.db
      .prepare(
        "INSERT INTO orders (id, customer_id, items_json, status) VALUES (?, ?, ?, ?)",
      )
      .bind(order.id, order.props.customerId, itemsJson, order.props.status)
      .run();
  }

  public async update(order: Order): Promise<void> {
    const itemsJson = JSON.stringify(
      order.props.items.map((i) => ({
        id: i.id,
        name: i.props.name,
        amount: i.props.unitPrice.amount,
        currency: i.props.unitPrice.currency,
        quantity: i.props.quantity,
      })),
    );

    await this.db
      .prepare(
        "UPDATE orders SET customer_id = ?, items_json = ?, status = ? WHERE id = ?",
      )
      .bind(order.props.customerId, itemsJson, order.props.status, order.id)
      .run();
  }

  public async delete(id: string): Promise<void> {
    await this.db.prepare("DELETE FROM orders WHERE id = ?").bind(id).run();
  }

  public async findAll(): Promise<Order[]> {
    const { results } = await this.db
      .prepare("SELECT id FROM orders")
      .all<{ id: string }>();
    const orders: Order[] = [];
    for (const r of results) {
      const order = await this.findById(r.id);
      if (order) orders.push(order);
    }
    return orders;
  }
}
```
