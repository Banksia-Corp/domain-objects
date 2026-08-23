import { bench, describe } from "vitest";
import { Entity } from "../../src/entity";

interface UserProps {
  name: string;
  email: string;
  age: number;
}

class User extends Entity<UserProps> {}

describe("Entity Performance Benchmarks", () => {
  const userA1 = new User(
    { name: "Alice", email: "alice@example.com", age: 30 },
    "usr_1",
  );
  const userA2 = new User(
    { name: "Alice Updated", email: "alice.new@example.com", age: 31 },
    "usr_1",
  );
  const userB = new User(
    { name: "Bob", email: "bob@example.com", age: 25 },
    "usr_2",
  );

  bench("Entity.equals() - Same Identity", () => {
    userA1.equals(userA2);
  });

  bench("Entity.equals() - Same Instance", () => {
    userA1.equals(userA1);
  });

  bench("Entity.equals() - Different Identity", () => {
    userA1.equals(userB);
  });

  bench("Entity.equals() - Null / Undefined check", () => {
    userA1.equals(undefined);
  });

  bench("Entity instantiation", () => {
    new User(
      { name: "Charlie", email: "charlie@example.com", age: 40 },
      "usr_3",
    );
  });
});
