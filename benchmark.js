import { queueIncrement, amqpTearDown } from "./amqp-producer.js";
import { httpIncrement } from "./http-client.js";
import { gRpcIncrement } from "./grpc-client.js";
import incrementor from "./incrementor.js";

const functionIncrement = async (obj) => incrementor(obj);

const fetchCicles = async (calls, incrementFunction) => {
  const start = Date.now();

  for (let i = 0; i < calls; i += 1) {
    const response = await incrementFunction({ count: i });

    if (response.count != i + 1) {
      throw new Error("Invalid count result");
    }
  }

  const totalDurationMs = Date.now() - start;
  const averageDurationMs = totalDurationMs / (calls || 1);

  const results = {
    calls,
    totalDurationMs,
    averageDurationMs,
  };

  return results;
};

const displayResults = (type, results, functionResults) => {
  console.log(`\n${type}\n  results:`, results);

  if (functionResults) {
    const slowerRatio = Math.round(
      results.averageDurationMs / functionResults.averageDurationMs
    );
    console.log(`  ${slowerRatio}x slower than function call.`);
  }
};

const functionBenchmark = async () => {
  const results = await fetchCicles(1_000_000, functionIncrement);
  displayResults("Function", results);
  return results;
};

const gRpcBenchmark = async (functionResults) => {
  const results = await fetchCicles(1_000, gRpcIncrement);
  displayResults("gRPC", results, functionResults);
};

const httpBenchmark = async (functionResults) => {
  const results = await fetchCicles(1_000, httpIncrement);
  displayResults("HTTP", results, functionResults);
};

const queueBenchmark = async (functionResults) => {
  const results = await fetchCicles(1_000, queueIncrement);
  displayResults("Queue", results, functionResults);
};

const benchmark = async () => {
  console.log("------ Communication technologies benchmark ------");
  const functionResults = await functionBenchmark();
  await gRpcBenchmark(functionResults);
  await httpBenchmark(functionResults);
  await queueBenchmark(functionResults);
};

await benchmark();
await amqpTearDown();
