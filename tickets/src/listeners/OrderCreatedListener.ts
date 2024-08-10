import { Channels, NATSListener, NATSPublisher, OrderCreatedEvent, TicketUpdatedEvent } from "@app2/common";
import { QueueGroups } from "@app2/common/dist/natsTools/QueueGroups";
import { Message } from "node-nats-streaming";
import { Tickets } from "../models/tickets";

export class OrderCreatedListener extends NATSListener<OrderCreatedEvent> {
  channel =  Channels.ORDER_CREATED;
  queueGroupName = QueueGroups.TICKET_GROUP;

  async onMessage(data: OrderCreatedEvent, msg: Message) {
    const ticket = await Tickets.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('ticket not found');
    }

    ticket.set({
      orderId: data.id,
    });

    await ticket.save();
    await new NATSPublisher(this.client).publish<TicketUpdatedEvent>(Channels.TICKET_UPDATED, {
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    msg.ack();
  } 
}