import { bench, describe } from "vitest";
import { ValueObject } from "../../src/value-object";

interface SimpleProps {
  amount: number;
  currency: string;
}

class Money extends ValueObject<SimpleProps> {}

interface ComplexProps {
  street: string;
  city: string;
  zipCode: string;
  metadata: {
    verified: boolean;
    tags: string[];
    geo: {
      lat: number;
      lng: number;
    };
  };
}

class Address extends ValueObject<ComplexProps> {}

describe("ValueObject Performance Benchmarks", () => {
  const moneyA = new Money({ amount: 100, currency: "USD" });
  const moneyB = new Money({ amount: 100, currency: "USD" });
  const moneyC = new Money({ amount: 200, currency: "EUR" });

  const complexA = new Address({
    street: "123 Main St",
    city: "Sydney",
    zipCode: "2000",
    metadata: {
      verified: true,
      tags: ["headquarters", "commercial"],
      geo: { lat: -33.8688, lng: 151.2093 },
    },
  });

  const complexB = new Address({
    street: "123 Main St",
    city: "Sydney",
    zipCode: "2000",
    metadata: {
      verified: true,
      tags: ["headquarters", "commercial"],
      geo: { lat: -33.8688, lng: 151.2093 },
    },
  });

  const complexC = new Address({
    street: "456 Other St",
    city: "Melbourne",
    zipCode: "3000",
    metadata: {
      verified: false,
      tags: ["branch"],
      geo: { lat: -37.8136, lng: 144.9631 },
    },
  });

  bench("Simple ValueObject.equals() - Equal", () => {
    moneyA.equals(moneyB);
  });

  bench("Simple ValueObject.equals() - Unequal", () => {
    moneyA.equals(moneyC);
  });

  bench("Complex Nested ValueObject.equals() - Equal", () => {
    complexA.equals(complexB);
  });

  bench("Complex Nested ValueObject.equals() - Unequal", () => {
    complexA.equals(complexC);
  });

  bench("ValueObject instantiation & deep freeze", () => {
    new Money({ amount: 50, currency: "AUD" });
  });
});
