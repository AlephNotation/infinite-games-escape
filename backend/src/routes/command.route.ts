import { z } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";

export const ParamsSchema = z.object({
  ip: z.string().ip(),
  command: z.string(),
});

const route = createRoute({
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
