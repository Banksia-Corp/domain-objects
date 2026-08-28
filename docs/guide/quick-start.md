# Quick Start in 5 Minutes

Let's model an e-commerce **Order Fulfillment** domain with currency-safe money calculations, item entity tracking, invariant validation, and domain event publishing.

---

## 1. Immutable Value Object: `Money`

Value Objects represent concepts with no persistent identity. They are defined solely by their attributes and are deeply frozen at runtime.

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

## 2. Child Entity: `OrderItem`

Entities are defined by a unique identity that persists across state changes and mutations.

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

## 3. Domain Event: `OrderPlacedEvent`

Domain Events capture business state transitions as immutable records for downstream subscribers and asynchronous messaging.

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

## 4. Aggregate Root: `Order`

The Aggregate Root guards transactional boundaries and enforces domain invariants. All mutations to child entities must go through root methods.

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
