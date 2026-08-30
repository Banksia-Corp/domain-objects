# Entities & Identity

In Domain-Driven Design, an **Entity** represents a domain concept defined by an explicit, continuous **identity** (`id`) rather than its attributes.

---

## Key Characteristics

- **Unique Identity**: Every entity has a unique identifier (`id`).
- **Persistent Across Changes**: Attributes of an entity may change over time as business operations take place, but its identity remains constant.
- **Identity-Based Equality**: Two entities with identical attributes are distinct if their IDs differ. Conversely, two entity references with the same ID represent the same domain entity, even if one has newer data in memory.

---

## The `Entity<T>` Base Class

`@banksia/domain-objects` provides the generic abstract base class `Entity<T>`:

```ts
export abstract class Entity<T> {
  protected readonly _id: string;
  public props: T;

  constructor(props: T, id: string);
  get id(): string;
  public equals(object?: Entity<T>): boolean;
}
```

---

## Implementation Example

```ts
import { Entity } from "@banksia/domain-objects";

export interface CustomerProps {
  name: string;
  email: string;
  isActive: boolean;
}

export class Customer extends Entity<CustomerProps> {
  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  public changeEmail(newEmail: string): void {
    if (!newEmail.includes("@")) {
      throw new Error("Invalid email format");
    }
    this.props.email = newEmail;
  }

  public deactivate(): void {
    this.props.isActive = false;
  }
}
```

---

## Identity Equality (`equals`)

The `equals` method compares entities based on their `id` rather than JavaScript object references:

```ts
const cust1 = new Customer(
  { name: "Alice", email: "alice@example.com", isActive: true },
  "cust_001",
);

const cust2 = new Customer(
  { name: "Alice Smith", email: "alice.smith@example.com", isActive: true },
  "cust_001",
);

console.log(cust1.equals(cust2)); // true (matched by id 'cust_001')
console.log(cust1 === cust2); // false (distinct instances in memory)
```

---

## Encapsulating Entity Mutations

Directly mutating an entity's properties from external callers bypasses business rules. Expose explicit domain methods to update state safely:

```ts
// ❌ Avoid direct property mutation from external callers:
// customer.props.email = 'new@example.com';

// ✅ Call explicit domain methods:
customer.changeEmail("alice@company.com");
```
