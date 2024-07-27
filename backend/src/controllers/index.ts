import { get } from "http";
import redis from "../../utils/redisClient";

export const parseCommand = async (command: string) => {
    const hash = await Bun.hash(command);
    // if this hash doesn't exist 
    // create it
    // run the command associated with the hash

    if (!await redis.exists(hash.toString())) {
        const commandOutput = await runCommand(command);
        redis.set(hash.toString(), commandOutput);
        return commandOutput;
    }
    else {
        const commandOutput = await getData(hash.toString());
        return commandOutput;
    }
}

const runCommand = async (command: string) => {
    return "dummy command data for command: " + command;
}

const getData = async (hash: string) => {
    return await redis.get(hash);
}

parseCommand("echo hello world");    