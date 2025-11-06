# Communication technologies benchmark

This repository contains a small Node.js project that benchmarks different inter-process / inter-service communication styles: in-process function call, gRPC, HTTP, and AMQP (e.g. RabbitMQ queue).

The benchmark (`benchmark.js`) exercises a simple incrementor function through each transport and measures average latency.

## Table of contents

- Overview
- Prerequisites
- Installation
- Running the servers
- Running the benchmark

## Overview

The goal is to compare the relative cost of calling a simple increment function through different communication mechanisms. The project measures average time per call and prints a simple comparison versus the in-process function call.

## Prerequisites

- Node.js (recommended >=18) and npm
- AMQP broker (e.g. RabbitMQ)

## Installation

From the repository root:

```sh
npm install
```

Dependencies used by the project (from `package.json`):

- `express` — HTTP server
- `@grpc/grpc-js` and `@grpc/proto-loader` — gRPC server/client
- `amqplib` — AMQP client

Setup environment variables:

```sh
cp .env.example .env
```

Duplicate .env.example file and rename it to .env. The, edit it accordingly (if necessary).

## Running the servers

Open separate terminals for servers/consumers where appropriate.

- HTTP server/client:

  Start the HTTP server that listens in the specified HTTP_PORT environment variable.

  ```sh
  node http-server.js
  ```

- gRPC server/client:

  Start the gRPC server that listens at the address specified by GRPC_SERVER_ADDRESS environment variable.

  ```sh
  node grpc-server.js
  ```

- AMQP producer/consumer:

  Start the AMQP consumer which listens for requests and replies to the broker specified by AMQP_BROKER_URL environment variable.

  ```sh
  node amqp-consumer.js
  ```

## Running the benchmark

The benchmark will run the chained set of tests: in-process function, gRPC, HTTP, and queue.

Make sure any required servers are running (gRPC server, HTTP server and AMQP consumer). Then run:

```sh
node benchmark.js
```

Output example (summary):

```
------ Communication technologies benchmark ------

Function
  results: { calls: 1000000, totalDurationMs: 41, averageDurationMs: 0.000041 }

gRPC
  results: { calls: 1000, totalDurationMs: 272, averageDurationMs: 0.272 }
  6634x slower than function call.

HTTP
  results: { calls: 1000, totalDurationMs: 332, averageDurationMs: 0.332 }
  8098x slower than function call.

Queue
  results: { calls: 1000, totalDurationMs: 751, averageDurationMs: 0.751 }
  18317x slower than function call.
```

Note: the numbers above are illustrative — actual results depend on machine, Node version, and whether services run locally or remotely.
