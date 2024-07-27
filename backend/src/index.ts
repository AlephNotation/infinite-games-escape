import { Hono } from "hono";
import { commandRouter } from "./routes/command.route";
import { getRouterName, showRoutes } from "hono/dev";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("", commandRouter);

showRoutes(app, { verbose: true });
export default app;
