import { describe, it, expect } from "bun:test";
import { commandHandler } from "../src/ai/command";
import { bestModel } from "../src/ai/model";

describe("AI text response", () => {
  it("should return a response", async () => {
    const response = await commandHandler({
      command: "ls",
      systemPrompt: "You are simulating a terminal for a user",
      model: bestModel,
    });

    expect(response.terminalOutput.length).toBeGreaterThan(0);
  });
});
