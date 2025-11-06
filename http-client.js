import "dotenv/config";

const port = process.env.HTTP_PORT;

export const httpIncrement = async (obj) => {
  const response = await fetch(`http://localhost:${port}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  });

  const body = await response.json();

  return body;
};
