import { anthropic } from "@ai-sdk/anthropic";
import { generateObject, type CoreMessage } from "ai";

import { z } from "zod";

import { bestModel } from "./model";
import { ChatRequestMessage } from "./messages";

export const CommandResponseSchema = z.object({
  terminalOutput: z
    .array(z.string())
    .describe("The array of the console output"),
  thought: z.string().describe("The AI's thoughts on the command."),
});

const createMessages = (args: {
  command: string;
  systemPrompt: string;
  computerDetails?: string;
}): CoreMessage[] => {
  const messages: CoreMessage[] = [
    {
      role: "system",
      content: args.systemPrompt,
    },
    { role: "system", content: "I am simulating a terminal for a user" },
    {
      role: "user",
      content: args.command,
    },
  ];

  return messages;
};

export async function commandHandler(args: {
  command: string;
  model: any;
  systemPrompt: string;
  computerDetails?: string;
}) {
  const { object } = await generateObject({
    model: anthropic("claude-3-5-sonnet-20240620"),
    schema: CommandResponseSchema,
    messages: createMessages(args) as CoreMessage[],
  });

  return object;
}

commandHandler({
  command: "ls",
  systemPrompt: "You are simulating a terminal for a user",
  model: bestModel,
})
  .then(console.log)
  .catch(console.error);
