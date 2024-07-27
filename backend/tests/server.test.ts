import { describe, it, expect } from "bun:test";

import app from "../src/index";

it("test", async () => {
  const res = await app.request("/command", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      command: "ls -la",
      ip: "104.1.5.4",
      userId: "1234",
    }),
  });
  console.log(res.status);
  const fff = await res.json();
  console.log(fff);
  expect(fff.terminalOutput.length).toBeGreaterThan(0);
});

describe("Messages", () => {
  it("test", async () => {
    const res = await app.request("/user/1234/messages", {
      method: "GET",
    });
    console.log(res.status);
    const fff = await res.json();
    console.log("messages:", fff);
    expect(fff.length).toBeGreaterThan(0);
  });
});

describe("Should fetch a machine", () => {
  it("should generate a machine", async () => {
    const res = await app.request("/machine/140.4.9.2");

    expect(await res.json()).toBeDefined();
  });
});
