import "dotenv/config";
import path from "path";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

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

const client = new incrementorService.Incrementor(
  serverAddress,
  grpc.credentials.createInsecure()
);

export const gRpcIncrement = (obj) =>
  new Promise((res, rej) => {
    client.increment(obj, (error, response) => {
      if (error) {
        return rej(error);
      }

      res(response);
    });
  });
