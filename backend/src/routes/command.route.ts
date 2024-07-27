import { z } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { Hono } from "hono";



export const ParamsSchema = z.object({
  ip: z.string().ip(),
  command: z.string(),
});

const commandRoute = createRoute({
  method: "post",
  path: "/command",
  request: {
    body: {
      content: {
        "application/json": {
          schema: ParamsSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.string(),
        },
      },
      description: "Command executed successfully",
    },
  },

});

export default commandRoute;


