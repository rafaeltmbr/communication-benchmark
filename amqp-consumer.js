import "dotenv/config";
import amqp from "amqplib";

import incrementor from "./incrementor.js";

const BROKER_URL = process.env.AMQP_BROKER_URL;
const QUEUE_IN = "incrementor-request";

const connection = await amqp.connect(BROKER_URL);

const channel = await connection.createChannel();

await channel.assertQueue(QUEUE_IN, { durable: false });

channel.consume(
  QUEUE_IN,
  async (message) => {
    const count = parseInt(message.content.toString());
    const result = incrementor({ count });
    channel.sendToQueue(
      message.properties.replyTo,
      Buffer.from(result.count.toString()),
      { persistent: true, correlationId: message.properties.correlationId }
    );
  },
  { noAck: true }
);

console.log(`Consuming events from queue ${QUEUE_IN}`);

process.on("SIGINT", () => {
  connection.close();
  process.exit(0);
});
