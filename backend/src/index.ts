import { Hono } from "hono";
import { commandRouter } from "./routes/command.route";
import { chatMessagesRouter } from "./routes/chatMessages.route";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("", commandRouter);
app.route("", chatMessagesRouter);

export default app;
