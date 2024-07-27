import redis from "../../utils/redisClient";
import { commandHandler } from "../ai/command";
import { bestModel } from "../ai/model";

export const parseCommand = async (
    command: string,
    ip: string,
    userId: string
) => {
    const hash = await Bun.hash(command + ip).toString();
    // if this hash doesn't exist
    // create it
    // run the command associated with the hash

    if (!(await redis.exists(hash))) {
        const commandOutput = await commandHandler({
            command,
            machineId: ip,
            userId,
            model: bestModel,
        });
        await redis.set(hash.toString(), JSON.stringify(commandOutput.terminalOutput));
        return commandOutput;
    } else {
        return await redis.get(hash);
    }
};

const runCommand = async (command: string) => {
    return "dummy command data for command: " + command;
};

const getData = async (hash: string) => {
    return await redis.get(hash);
};


// scan
// connect - connect to a host
