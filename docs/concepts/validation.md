# Validation & Business Rules

In Domain-Driven Design, an **invariant** is a business rule that must always hold true. A domain object must never be allowed to enter or remain in an invalid state.

---

## Defensive Instantiation

Enforce rules directly in constructors and factory methods. If an input is invalid, reject instantiation immediately with an error:

```ts
import { ValueObject } from "@banksia/domain-objects";

export class Percentage extends ValueObject<{ value: number }> {
  constructor(props: { value: number }) {
    if (props.value < 0 || props.value > 100) {
      throw new RangeError(
        `Percentage value must be between 0 and 100, received: ${props.value}`,
      );
    }
    super(props);
  }

  get value(): number {
    return this.props.value;
  }
}
```

---

## Pairing with Schema Libraries (Zod / Valibot)

While `@banksia/domain-objects` has zero external dependencies, domain models can cleanly integrate with schema validation libraries like **Zod** or **Valibot** in application code:

```ts
import { z } from "zod";
import { ValueObject } from "@banksia/domain-objects";

const EmailSchema = z.string().email().min(5).max(255);

export class Email extends ValueObject<{ value: string }> {
  constructor(rawInput: string) {
    const validated = EmailSchema.parse(rawInput.trim().toLowerCase());
    super({ value: validated });
  }

  get value(): string {
    return this.props.value;
  }
}

// Valid instantiation:
const email = new Email("  Alice@Example.com ");
console.log(email.value); // 'alice@example.com'

// Invalid instantiation throws ZodError before instance creation:
// new Email('not-valid'); // throws ZodError
```

---

## State Transition Guarding

Aggregate Roots guard business rules during state transitions:

```ts
import { AggregateRoot } from "@banksia/domain-objects";

export class BankAccount extends AggregateRoot<{
  balance: number;
  isFrozen: boolean;
}> {
  public withdraw(amount: number): void {
    if (this.props.isFrozen) {
      throw new Error("Cannot withdraw from a frozen bank account");
    }
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be strictly positive");
    }
    if (this.props.balance - amount < 0) {
      throw new Error(
        `Insufficient funds. Current balance: ${this.props.balance}, requested: ${amount}`,
      );
    }

    this.props.balance -= amount;
  }
}
```

---

## Domain Errors vs System Exceptions

- **Domain Errors**: Represent expected business violations (e.g. `InsufficientFundsError`, `OrderAlreadyShippedError`). They convey meaningful, domain-specific rationale.
- **System Exceptions**: Represent infrastructure or programming defects (e.g. database network drops, JSON parse failures).
