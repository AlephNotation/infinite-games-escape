import { describe, it, expect } from "bun:test";

import { Hono } from "hono";
import { testClient } from "hono/testing";

import app from "../src/index";
import { use } from "hono/jsx";

it("test", async () => {
  const res = await app.request("/command", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      command: "ls",
      ip: "104.1.5.4",
      userId: "123",
    }),
  });
  console.log(res.status);
  const fff = await res.json();
  console.log(fff);
  expect(fff.terminalOutput.length).toBeGreaterThan(0);
});
