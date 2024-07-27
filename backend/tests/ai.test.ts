import { describe, it, expect } from "bun:test";
import { commandHandler } from "../src/ai/command";
import { bestModel } from "../src/ai/model";

describe("AI text response", () => {
  it("should return a response", async () => {
    const ip = "140.4.9.2";
    const response = await commandHandler({
      machineId: ip,
      command: "ls",
      userId: "123",
      model: bestModel,
    });

    expect(response.terminalOutput.length).toBeGreaterThan(0);
  });
});
