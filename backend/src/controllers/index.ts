import { get } from "http";
import redis from "../../utils/redisClient";

export const hashCommand = async (command: string) => {
    const hash = await Bun.hash(command);

    console.log('hash', hash)
    redis.set(hash.toString(), await runCommand(command));

    const value = await getData(hash.toString());
    console.log('the command we just set', value);
    return
}

const runCommand = async (command: string) => {
    return "dummy command data for command: " + command;
}

const getData = async (hash: string) => {
    return await redis.get(hash);
}

hashCommand("echo hello world");    