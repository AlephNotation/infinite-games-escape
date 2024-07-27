import { Hono } from "hono";
import { parseCommand } from "../controllers";

export const commandRouter = new Hono();

commandRouter.post("/command", async (c) => {
  const { command, ip, userId } = await c.req.json();
  const response = await parseCommand(command, ip, userId);
  return c.json(response);
});
