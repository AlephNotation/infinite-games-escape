import { Hono } from "hono";
import { getMachine } from "../ai/machines";

export const machineRouter = new Hono();

machineRouter.get("/machine/:ip", async (c) => {
  const { ip } = await c.req.param();
  const machine = getMachine(ip);

  if (machine) {
    return c.json(machine, 200);
  } else {
    return c.json({ message: "No machine found" }, 404);
  }
});
