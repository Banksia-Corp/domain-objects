import { bench, describe } from "vitest";
import { AggregateRoot } from "../../src/aggregate";
import { IDomainEvent } from "../../src/event";

interface OrderProps {
  customerId: string;
  total: number;
}

class OrderPlacedEvent implements IDomainEvent {
  public dateTimeOccurred: Date = new Date();
  constructor(
    public aggregateId: string,
    public total: number,
  ) {}
  getAggregateId(): string {
    return this.aggregateId;
  }
}

class Order extends AggregateRoot<OrderProps> {
  public placeOrder(): void {
    this.addDomainEvent(new OrderPlacedEvent(this.id, this.props.total));
  }
}

describe("AggregateRoot Performance Benchmarks", () => {
  const originalLog = console.log;
  // Mute stdout for benchmark iterations
  console.log = () => {};

  const order = new Order({ customerId: "cust_1", total: 150 }, "ord_100");
  const event = new OrderPlacedEvent("ord_100", 150);

  bench("AggregateRoot.domainEvents getter", () => {
    const _events = order.domainEvents;
  });

  bench("AggregateRoot lifecycle: create, record, pull, clear", () => {
    const agg = new Order({ customerId: "cust_2", total: 200 }, "ord_200");
    agg.placeOrder();
    const _events = agg.domainEvents;
    agg.clearEvents();
  });

  bench("AggregateRoot.clearEvents()", () => {
    order.clearEvents();
  });
});
