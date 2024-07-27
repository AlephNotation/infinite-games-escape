import { describe, it, expect } from "bun:test";
import { generateMachine, getMachine } from "../src/ai/machines";
import redis from "../utils/redisClient";

import { randomUUID } from "crypto";

describe("AI text response", () => {
  const ip = "140.4.9.2";
  it("should return a response", async () => {
    const response = await generateMachine({
      ip: ip,
      userPrompt:
        "Generate a fictional machine spec based on the IP address. This is a custom super computer used by the airforce.",
    });

    console.log(response);
    expect(response).toBeDefined();
  });

  it("should set a machien when it doesnt exist", async () => {
    const randomIp = randomUUID();
    const response = await getMachine(randomUUID());

    console.log(response);

    expect(redis.get(Bun.hash(randomIp).toString())).toBeDefined();
  });
});
