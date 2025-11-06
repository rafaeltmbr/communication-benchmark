import "dotenv/config";
import amqp from "amqplib";

const BROKER_URL = process.env.AMQP_BROKER_URL;
const QUEUE_IN = "incrementor-request";
const QUEUE_OUT = "incrementor-response";

const connection = await amqp.connect(BROKER_URL);

const channel = await connection.createChannel();
await channel.prefetch(1);

await channel.assertQueue(QUEUE_IN, { durable: false });
await channel.assertQueue(QUEUE_OUT, { durable: false });

const callbackMap = new Map();

channel.consume(
  QUEUE_OUT,
  async (message) => {
    const { correlationId } = message.properties;
    const callback = callbackMap.get(correlationId);
    if (!callback) return;

    callbackMap.delete(correlationId);
    const count = parseInt(message.content.toString());
    callback({ count });
  },
  { noAck: true }
);

export const queueIncrement = async (obj) => {
  const correlationId = (Math.random() + Math.random()).toString();
  channel.sendToQueue(QUEUE_IN, Buffer.from(obj.count.toString()), {
    persistent: false,
    correlationId,
    replyTo: QUEUE_OUT,
  });

  return new Promise((res) => {
    callbackMap.set(correlationId, res);
  });
};

export const amqpTearDown = async () => {
  await connection.close();
};
