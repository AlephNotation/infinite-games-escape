import redis from "../../utils/redisClient";
import { commandHandler } from "../ai/command";
import { generateMachine } from "../ai/machines";
import { bestModel } from "../ai/model";
import { z } from "zod";

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const generateIP = () => {
  const ip =
    Math.floor(Math.random() * 255) +
    1 +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255);

  return ip;
};

export async function handleGenerateMachine(ip: string) {
  const randomNumber = Math.random();

  if (randomNumber < 0.5) {
    return await generateMachine({
      ip,
      userPrompt:
        "This machine should be some sort of commonplace server. Like a web server or or an IOT device.",
    });
  }

  if (randomNumber > 0.5) {
    return await generateMachine({
      ip,
      userPrompt:
        "This machine should be a laptop. It's a personal computer used for work and school.",
    });
  }

  if (randomNumber > 0.9) {
    return await generateMachine({
      ip,
      userPrompt:
        "This machine should be a powerful server. It's used for running large scale applications.",
    });

    return ip;
  }
  if (randomNumber > 0.95) {
    return await generateMachine({
      ip,
      userPrompt:
        "This machine is a super computer. It's used for running simulations and other high performance computing tasks and used at the DOD. It has the highest level of security",
    });
  }

  return await generateMachine({
    ip,
    userPrompt:
      "This machine should be a desktop. It's a personal computer used for gaming and other personal tasks.",
  });
}
const ipAddr = z.string().ip();

export const handleSpecialCommand = async (command: string, ip: string) => {
  const commandArr = command.split(" ");

  switch (commandArr[0]) {
    case "scan":
      const numIps: number =
        ip === "localhost" ? 12 : randomIntFromInterval(1, 10);
      const ips = [];
      for (let i = 0; i < numIps; i++) {
        ips.push(generateIP());
      }
      return { terminalOutput: ips };
    case "connect":
      const res = ipAddr.safeParse(commandArr[1]);
      if (!res.success) {
        return { terminalOutput: "Invalid IP address" };
      }
      handleGenerateMachine(commandArr[1]);

      return { terminalOutput: "Connected to " + commandArr[1] };

    default:
      return undefined;
  }
};

export const parseCommand = async (
  command: string,
  ip: string,
  userId: string,
  cwd?: string
) => {
  const hash = await Bun.hash(command + ip).toString();
  // if this hash doesn't exist
  // create it
  // run the command associated with the hash

  if (!(await redis.exists(hash))) {
    const specialCommand = await handleSpecialCommand(command, ip);

    if (specialCommand) {
      return { ...specialCommand, cwd: cwd || "~" };
    }
    const commandOutput = await commandHandler({
      command,
      machineId: ip,
      userId,
      model: bestModel,
      cd: cwd,
    });
    await redis.set(hash.toString(), JSON.stringify(commandOutput));
    return commandOutput;
  } else {
    const redisData = await redis.get(hash);
    return JSON.parse(redisData as string);
  }
};
