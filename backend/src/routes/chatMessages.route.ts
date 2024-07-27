import { Hono } from "hono";
import { getChatMessages } from "../ai/messages";

export const chatMessagesRouter = new Hono();

chatMessagesRouter.get("/user/:userId/messages", async (c) => {
  const { userId } = c.req.param();
  const messages = await getChatMessages(userId);
  console.log(messages);
  const formatedMessages = messages?.map((message) => {
    if (message.role === "user") {
      return {
        role: message.role,
        content: message.content,
      };
    }

    if (message.role === "assistant") {
      return {
        role: message.role,
        content: JSON.parse(message.content as string),
      };
    }
  });
  if (messages) {
    return c.json(formatedMessages, 200);
  } else {
    return c.json({ message: "No messages found" }, 404);
  }
});
