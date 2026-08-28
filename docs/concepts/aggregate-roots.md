# Aggregate Roots & Consistency Boundaries

An **Aggregate Root** is a specialized `Entity` that acts as the sole external gateway and guardian for a cluster of associated entities and value objects (an _Aggregate_).

---

## The Aggregate Pattern

In Domain-Driven Design:

- **Transactional Boundary**: An aggregate marks the boundary within which all business invariants must be maintained consistently in every transaction.
- **Single Entry Point**: Outside objects hold references only to the Aggregate Root. Child entities cannot be referenced or updated directly from outside the boundary.
- **Event Recording Hub**: The aggregate root records domain events as business operations occur and buffers them until the aggregate is persisted.

---

## The `AggregateRoot<T>` Base Class

`@banksia/domain-objects` provides `AggregateRoot<T>` which extends `Entity<T>`:

```ts
export abstract class AggregateRoot<T> extends Entity<T> {
  get domainEvents(): IDomainEvent[];
  protected addDomainEvent(domainEvent: IDomainEvent): void;
  public clearEvents(): void;
}
```

---

## Implementation Example: `Invoice` Aggregate

```ts
import {
  AggregateRoot,
  Entity,
  ValueObject,
  type IDomainEvent,
} from "@banksia/domain-objects";

// Value Object
export class LineItemTotal extends ValueObject<{
  amount: number;
  currency: string;
}> {}

// Child Entity
export class LineItem extends Entity<{
  description: string;
  price: number;
  quantity: number;
}> {
  get total(): number {
    return this.props.price * this.props.quantity;
  }
}

// Domain Event
export class InvoiceIssuedEvent implements IDomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(
    public readonly invoiceId: string,
    public readonly total: number,
  ) {}

  public getAggregateId(): string {
    return this.invoiceId;
  }
}

// Aggregate Root
export interface InvoiceProps {
  customerNumber: string;
  items: LineItem[];
  status: "draft" | "issued" | "paid";
}

export class Invoice extends AggregateRoot<InvoiceProps> {
  public static createDraft(id: string, customerNumber: string): Invoice {
    return new Invoice({ customerNumber, items: [], status: "draft" }, id);
  }

  public addLineItem(
    description: string,
    price: number,
    quantity: number,
  ): void {
    if (this.props.status !== "draft") {
      throw new Error("Cannot add line items to a non-draft invoice");
    }
    const item = new LineItem(
      { description, price, quantity },
      `item_${this.props.items.length + 1}`,
    );
    this.props.items.push(item);
  }

  public issue(): void {
    if (this.props.items.length === 0) {
      throw new Error("Cannot issue an invoice without line items");
    }
    if (this.props.status !== "draft") {
      throw new Error("Only draft invoices can be issued");
    }

    this.props.status = "issued";
    const total = this.props.items.reduce((sum, item) => sum + item.total, 0);

    // Record domain event
    this.addDomainEvent(new InvoiceIssuedEvent(this.id, total));
  }
}
```

---

## Domain Event Lifecycle

1. **State Mutation**: When a business method executes, validate invariants and mutate aggregate state.
2. **Buffer Event**: Call `this.addDomainEvent(new Event(...))` to buffer the uncommitted event.
3. **Persist Aggregate**: The repository saves the aggregate to storage within an atomic transaction.
4. **Dispatch & Clear**: Once storage confirms the commit, the event bus publishes all `aggregate.domainEvents` and calls `aggregate.clearEvents()`.

```ts
const invoice = Invoice.createDraft("inv_1", "cust_99");
invoice.addLineItem("Consulting", 250, 4);
invoice.issue();

console.log(invoice.domainEvents.length); // 1 (InvoiceIssuedEvent)

// Publish buffered events via application service
await eventBus.publishAll(invoice.domainEvents);

// Clear event buffer
invoice.clearEvents();
console.log(invoice.domainEvents.length); // 0
```
