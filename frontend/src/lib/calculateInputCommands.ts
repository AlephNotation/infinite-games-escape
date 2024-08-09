import { Command } from "./types";

export const calculateInputCommands = (allCommands: Command[]): Command[] => {
    const inputCommands = allCommands.filter(command => command.isInput);
    return inputCommands;

}