import { anthropic } from "@ai-sdk/anthropic";
import { generateObject, type CoreMessage } from "ai";

import { z } from "zod";
import { MachineSchema, getMachine } from "./machines";

export const CommandResponseSchema = z.object({
  terminalOutput: z
    .array(z.string())
    .describe("The array of the console output"),
  thought: z.string().describe("The AI's thoughts on the command."),
});

const createMessages = (args: {
  command: string;
  systemPrompt: string;
  computerDetails?: MachineSchema;
}): CoreMessage[] => {
  const messages: CoreMessage[] = [
    {
      role: "system",
      content: args.systemPrompt,
    },
  ];

  if (args.computerDetails) {
    messages.push({
      role: "system",
      content: `Here are the details for the computer the user is connected to: ${args.computerDetails}`,
    });
  }

  messages.push({
    role: "user",
    content: args.command,
  });

  return messages;
};

export async function commandHandler(args: {
  machineId: string;
  command: string;
  userId: string;
  model: any;
}) {
  const systemPrompt =
    "You are simulating a terminal for a user. Only respond in commands valid for the shell you are simulating.";

  const machineinfo = await getMachine(args.machineId);
  const { object } = await generateObject({
    model: anthropic("claude-3-5-sonnet-20240620"),
    schema: CommandResponseSchema,
    messages: createMessages({
      ...args,
      systemPrompt,
      computerDetails: machineinfo,
    }) as CoreMessage[],
  });

  return object;
}
