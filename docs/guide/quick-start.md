# Quick Start in 5 Minutes

Let's model an e-commerce **Order Fulfillment** domain with currency-safe money calculations, item entity tracking, invariant validation, and domain event publishing.

---

## 1. Values: `Money`

Values represent concepts with no identity. They are defined solely by their attributes and are immutable.

```ts
import { ValueObject } from "@banksia/domain-objects";

export interface MoneyProps {
  amount: number;
  currency: string;
}

export class Money extends ValueObject<MoneyProps> {
  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  public add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error(
        `Cannot add currency ${other.currency} to ${this.currency}`,
      );
    }
    return new Money({
      amount: this.amount + other.amount,
      currency: this.currency,
    });
  }
}
```

---

## 2. Entities: `OrderItem`

Entities represent concepts defined by a unique identity that persists across state changes.

```ts
import { Entity } from "@banksia/domain-objects";

export interface OrderItemProps {
  name: string;
  unitPrice: Money;
  quantity: number;
}

export class OrderItem extends Entity<OrderItemProps> {
  get total(): Money {
    return new Money({
      amount: this.props.unitPrice.amount * this.props.quantity,
      currency: this.props.unitPrice.currency,
    });
  }
}
```

---

## 3. Domain Events: `OrderPlacedEvent`

Domain Events capture business occurrences as immutable records for downstream subscribers and message dispatchers.

```ts
import type { IDomainEvent } from "@banksia/domain-objects";

export class OrderPlacedEvent implements IDomainEvent {
  public readonly dateTimeOccurred = new Date();

  constructor(
    public readonly orderId: string,
    public readonly totalAmount: number,
  ) {}

  public getAggregateId(): string {
    return this.orderId;
  }
}
```

---

## 4. Aggregates: `Order`

The Aggregate Root guards business rules across the entire group. All modifications to child entities and state must go through methods on the root.

```ts
import { AggregateRoot } from "@banksia/domain-objects";

export interface OrderProps {
  customerId: string;
  items: OrderItem[];
  status: "draft" | "placed" | "paid" | "cancelled";
}

export class Order extends AggregateRoot<OrderProps> {
  public static create(id: string, customerId: string): Order {
    return new Order({ customerId, items: [], status: "draft" }, id);
  }

  public addItem(item: OrderItem): void {
    if (this.props.status !== "draft") {
      throw new Error(
        "Cannot add items to an order that is no longer in draft status",
      );
    }
    this.props.items.push(item);
  }

  public placeOrder(): void {
    if (this.props.items.length === 0) {
      throw new Error("Cannot place an empty order");
    }
    if (this.props.status !== "draft") {
      throw new Error("Order is already placed or cancelled");
    }

    this.props.status = "placed";
    const totalAmount = this.props.items.reduce(
      (sum, item) => sum + item.total.amount,
      0,
    );

    // Record domain event for dispatch after persistence
    this.addDomainEvent(new OrderPlacedEvent(this.id, totalAmount));
  }
}
```

---

## 5. Usage in an Application Service

Application services orchestrate loading from a repository, running domain operations, persisting changes, and dispatching uncommitted events:

```ts
const order = Order.create("ord_101", "cust_202");

order.addItem(
  new OrderItem(
    {
      name: "Ergonomic Keyboard",
      unitPrice: new Money({ amount: 150, currency: "USD" }),
      quantity: 1,
    },
    "item_1",
  ),
);

// Enforce invariants and record event
order.placeOrder();

// Access buffered domain events
console.log(order.domainEvents); // [ OrderPlacedEvent { ... } ]

// After persisting to the database and dispatching events:
order.clearEvents();
console.log(order.domainEvents.length); // 0
```
