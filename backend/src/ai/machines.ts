import { generateObject, type CoreMessage } from "ai";
import { z } from "zod";
import redis from "../../utils/redisClient";

import { fastModel } from "./model";

export const MachineSchema = z.object({
  type: z
    .string()
    .describe("The type of machine (e.g. 'server', 'laptop', 'desktop')"),
  org: z.string().describe("The organization that owns the machine"),
  os: z.string().describe("The operating system of the machine"),
  hardware: z.string().describe("The hardware of the machine"),
  hasRoot: z.boolean().describe("Whether the user has root access"),
  shell: z.string().describe("The shell the user is using"),
  hasGPU: z.boolean().describe("Whether the machine has a GPU"),
});

export type MachineSchema = z.infer<typeof MachineSchema>;

export const generateMachine = async (args: {
  ip: string;
  userPrompt: string;
}): Promise<MachineSchema> => {
  const messages: CoreMessage[] = [
    {
      role: "system",
      content: `describe the computer associated with the fictional ip address ${args.ip}. Assume the user is not root unless hasRoot is true or they are on localhost`,
    },
    {
      role: "user",
      content: args.userPrompt,
    },
  ];
  const { object } = await generateObject({
    model: fastModel,
    schema: MachineSchema,
    messages,
  });

  redis.set(args.ip, JSON.stringify(object));

  return object;
};

export const getMachine = async (ip: string): Promise<MachineSchema> => {
  const hash = await Bun.hash(ip).toString();
  const machine = await redis.get(hash);
  if (machine) {
    return MachineSchema.parse(JSON.parse(machine));
  }

  const newMachine = await generateMachine({
    ip,
    userPrompt: `Generate a fictional machine spec based on the IP address. This is a custom super computer used by the airforce.`,
  });
  redis.set(hash, JSON.stringify(newMachine));

  return newMachine;
};
