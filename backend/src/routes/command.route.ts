import { Hono } from "hono";
import { parseCommand } from "../controllers";

export const commandRouter = new Hono();

commandRouter.post("/command", async (c) => {
  const { command, cwd, ip, userId } = await c.req.json();
  console.log("ayo", command, cwd, ip, userId);
  const response = await parseCommand(command, ip, userId, cwd);
  console.log('boyo', response)
  return c.json(response);
});
