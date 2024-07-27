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

describe.skip("Messages", () => {
  it("test", async () => {
    const res = await app.request("/user/123/messages", {
      method: "GET",
    });
    console.log(res.status);
    const fff = await res.json();
    expect(fff.length).toBeGreaterThan(0);
  });
});
