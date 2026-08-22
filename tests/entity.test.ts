import { describe, expect, test } from "vitest";
import { Entity } from "../src/entity";

class Car extends Entity<{ make: string; model: string }> {}

describe("Entity Domain Object", () => {
  test("should create an entity successfully", () => {
    const result = new Car({ make: "Toyota", model: "Corolla" }, "1");
    expect(result.id).toBe("1");
  });
  test("should compare two entities with the same ID as equal", () => {
    const car1 = new Car({ make: "Toyota", model: "Corolla" }, "1");
    const car2 = new Car({ make: "Honda", model: "Civic" }, "1");
    expect(car1.equals(car2)).toBe(true);
  });
  test("should compare two entities with different IDs as not equal", () => {
    const car1 = new Car({ make: "Toyota", model: "Corolla" }, "1");
    const car2 = new Car({ make: "Honda", model: "Civic" }, "2");
    expect(car1.equals(car2)).toBe(false);
  });
});
