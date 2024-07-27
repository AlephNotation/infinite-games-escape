import { describe, it, expect } from "bun:test";
import { getChatMessages, storeChatMessage } from "../src/ai/messages";
import type { CoreMessage } from "ai";

describe("messags should persist", () => {
  it("should set a message", async () => {
    const messages: CoreMessage[] = [
      {
        role: "user",
        content: "Hello",
      },
      {
        role: "assistant",
        content: "Welcome to the system",
      },
    ];
    await storeChatMessage("123", messages);

    const response = await getChatMessages("123");
    console.log(response);
    expect(response).toBeDefined();
  });
});
