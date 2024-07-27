import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/command", async (c) => {
  const body = await c.req.parseBody();
});
export default app;
