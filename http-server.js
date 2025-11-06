import "dotenv/config";
import express from "express";

import incrementor from "./incrementor.js";

const app = express();

const port = parseInt(process.env.HTTP_PORT);

app.use(express.json());

app.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);

app.post("/", (req, res) => {
  const result = incrementor(req.body);
  res.json(result);
});
