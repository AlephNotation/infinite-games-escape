import { Hono } from "hono";
import { cors } from 'hono/cors'

import { commandRouter } from "./routes/command.route";
import { chatMessagesRouter } from "./routes/chatMessages.route";
import { machineRouter } from "./routes/machine.route";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});


// Apply CORS middleware to all routes
app.use('*', cors())


app.route("", commandRouter);
app.route("", chatMessagesRouter);
app.route("", machineRouter);

export default app;
