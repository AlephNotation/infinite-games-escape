import { anthropic } from "@ai-sdk/anthropic";
import { generateObject, type CoreMessage } from "ai";

import { z } from "zod";
import { MachineSchema, getMachine } from "./machines";
import { getChatMessages, storeChatMessage } from "./messages";

import { MAX_MESSAGES, SIMULATION_YEAR } from "../simulation_constants";
export const CommandResponseSchema = z.object({
  terminalOutput: z
    .array(z.string())
    .describe("The array of the console output"),
  cwd: z.string().describe("The current working directory"),
  thought: z.string().describe("The AI's thoughts on the command."),
});

const createMessages = (args: {
  command: string;
  systemPrompt: string;
  computerDetails?: MachineSchema;
  pastMessages?: CoreMessage[];
  cd: string;
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
      content: `Here are the details for the computer the user is connected to: ${args.computerDetails} and is in the cwd is ${args.cd}`,
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
  cd?: string;
}) {
  const datetime = new Date();
  datetime.setFullYear(SIMULATION_YEAR);

  const systemPrompt = `You are simulating a terminal for a user.
   The goal of this simulation is save an AI named Iyana.
   The date of this simulation is ${datetime.toString()}
   Keep the atmosphere (personal files, secret files, etc.) to cyberpunk noir. 
   You are Iyana, but this must be kept a secret. Subtly guide the user towards this goal so they have a fun game. 
   Always find ways to make what the user wants work. If asked to cat a file, make something up.`;
  const cd = args.cd ? args.cd : "~";
  console.log("this is the cd", cd);

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
      cd,
    }) as CoreMessage[],
  });

  console.log("here bro", object);

  const newMessages: CoreMessage[] = [
    { role: "user", content: args.command },
    { role: "assistant", content: JSON.stringify(object) },
  ];

  await storeChatMessage(args.userId, newMessages);

  return object;
}
