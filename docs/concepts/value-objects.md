# Value Objects

A **Value Object** describes a characteristic, descriptive element, or quantitative measure in the domain that has **no conceptual identity**. Value Objects are defined strictly by the equality of their attribute values.

---

## Key Invariants

1. **No Conceptual Identity**: Value objects do not have an `id`. If two value objects have the same attributes, they are interchangeable.
2. **Deep Immutability**: Value objects cannot be mutated once created. The constructor automatically executes `Object.freeze` on properties. Any "mutation" operation returns a new instance.
3. **Structural Equality**: Equality is determined by comparing property values rather than object references.
4. **Self-Validation**: A value object is guaranteed to be valid throughout its existence. If invalid input is provided, the constructor immediately rejects instantiation.

---

## The `ValueObject<T>` Base Class

`@banksia/domain-objects` provides the `ValueObject<T>` base class:

```ts
export abstract class ValueObject<T> {
  protected readonly props: T;

  constructor(props: T);
  public equals(valueObject?: ValueObject<T>): boolean;
}
```

---

## Implementation Example: Postal Address

```ts
import { ValueObject } from "@banksia/domain-objects";

export interface AddressProps {
  street: string;
  city: string;
  postcode: string;
  country: string;
}

export class Address extends ValueObject<AddressProps> {
  constructor(props: AddressProps) {
    if (!props.street || !props.city || !props.postcode) {
      throw new Error("Address requires street, city, and postcode");
    }
    super(props);
  }

  get street(): string {
    return this.props.street;
  }

  get city(): string {
    return this.props.city;
  }

  get postcode(): string {
    return this.props.postcode;
  }

  get country(): string {
    return this.props.country;
  }

  public withStreet(newStreet: string): Address {
    return new Address({
      ...this.props,
      street: newStreet,
    });
  }
}
```

---

## Structural Equality (`equals`)

Two separate value object instances with identical property values are strictly equal:

```ts
const addr1 = new Address({
  street: "123 George St",
  city: "Sydney",
  postcode: "2000",
  country: "AU",
});

const addr2 = new Address({
  street: "123 George St",
  city: "Sydney",
  postcode: "2000",
  country: "AU",
});

console.log(addr1.equals(addr2)); // true (structural equality)
console.log(addr1 === addr2); // false (different memory references)
```

---

## Runtime Immutability

Because `Object.freeze` is applied in the constructor, attempts to mutate properties at runtime throw in strict mode:

```ts
const addr = new Address({
  street: "123 George St",
  city: "Sydney",
  postcode: "2000",
  country: "AU",
});

// Throws TypeError: Cannot assign to read only property in strict mode
// (addr as any).props.street = '456 Pitt St';
```
