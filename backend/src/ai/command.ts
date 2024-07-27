import { anthropic } from "@ai-sdk/anthropic";
import { generateObject, type CoreMessage } from "ai";

import { z } from "zod";
import { MachineSchema, getMachine } from "./machines";
import { getChatMessages, storeChatMessage } from "./messages";

const MAX_MESSAGES = (process.env.MAX_MESSAGES as unknown as number) || 50;

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
  pastMessages?: CoreMessage[];
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

  if (args.pastMessages) {
    messages.concat(args.pastMessages.slice(0, MAX_MESSAGES));
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

  const pastMessages = await getChatMessages(args.userId);
  console.log(pastMessages);
  const machineinfo = await getMachine(args.machineId);
  const { object } = await generateObject({
    model: anthropic("claude-3-5-sonnet-20240620"),
    schema: CommandResponseSchema,
    messages: createMessages({
      ...args,
      systemPrompt,
      computerDetails: machineinfo,
      pastMessages,
    }) as CoreMessage[],
  });

  const newMessages: CoreMessage[] = [
    { role: "user", content: args.command },
    { role: "assistant", content: JSON.stringify(object) },
  ];

  await storeChatMessage(args.userId, newMessages);

  return object;
}
