import "dotenv/config";
import path from "path";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import incrementor from "./incrementor.js";

const serverAddress = process.env.GRPC_SERVER_ADDRESS;

const protoPath = path.resolve(path.resolve(), "./incrementor.proto");
const packageDefinition = await protoLoader.load(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const incrementorService =
  grpc.loadPackageDefinition(packageDefinition).incrementor;

const server = new grpc.Server();

const incrementHandler = (call, callback) => {
  const response = incrementor(call.request);
  callback(null, response);
};

server.addService(incrementorService.Incrementor.service, {
  increment: incrementHandler,
});

server.bindAsync(
  serverAddress,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      return console.error(err);
    }

    console.log(`gRPC server listening at localhost:${port}`);
  }
);
