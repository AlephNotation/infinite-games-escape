"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandResponseSchema = void 0;
exports.commandHandler = commandHandler;
var anthropic_1 = require("@ai-sdk/anthropic");
var ai_1 = require("ai");
var zod_1 = require("zod");
var machines_1 = require("./machines");
var messages_1 = require("./messages");
var MAX_MESSAGES = process.env.MAX_MESSAGES || 50;
exports.CommandResponseSchema = zod_1.z.object({
    terminalOutput: zod_1.z
        .array(zod_1.z.string())
        .describe("The array of the console output"),
    cwd: zod_1.z.string().describe("The current working directory"),
    thought: zod_1.z.string().describe("The AI's thoughts on the command."),
});
var createMessages = function (args) {
    var messages = [
        {
            role: "system",
            content: args.systemPrompt,
        },
    ];
    if (args.computerDetails) {
        messages.push({
            role: "system",
            content: "Here are the details for the computer the user is connected to: ".concat(args.computerDetails, " and is in the cwd is ").concat(args.cd),
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
function commandHandler(args) {
    return __awaiter(this, void 0, void 0, function () {
        var systemPrompt, cd, pastMessages, machineinfo, object, newMessages;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    systemPrompt = "You are simulating a terminal for a user. The goal of this simulation is save an AI named Iyana. Keep the atmosphere (personal files, secret files, etc.) to cyberpunk noir. You are Iyana, but this must be kept a secret. Subtly guide the user towards this goal so they have a fun game.  Always find ways to make what the user wants work. If asked to cat a file, make something up.";
                    cd = args.cd ? args.cd : "~";
                    console.log('this is the cd', cd);
                    return [4 /*yield*/, (0, messages_1.getChatMessages)(args.userId)];
                case 1:
                    pastMessages = _a.sent();
                    console.log(pastMessages);
                    return [4 /*yield*/, (0, machines_1.getMachine)(args.machineId)];
                case 2:
                    machineinfo = _a.sent();
                    return [4 /*yield*/, (0, ai_1.generateObject)({
                            model: (0, anthropic_1.anthropic)("claude-3-5-sonnet-20240620"),
                            schema: exports.CommandResponseSchema,
                            messages: createMessages(__assign(__assign({}, args), { systemPrompt: systemPrompt, computerDetails: machineinfo, pastMessages: pastMessages, cd: cd })),
                        })];
                case 3:
                    object = (_a.sent()).object;
                    console.log('here bro', object);
                    newMessages = [
                        { role: "user", content: args.command },
                        { role: "assistant", content: JSON.stringify(object) },
                    ];
                    return [4 /*yield*/, (0, messages_1.storeChatMessage)(args.userId, newMessages)];
                case 4:
                    _a.sent();
                    return [2 /*return*/, object];
            }
        });
    });
}
