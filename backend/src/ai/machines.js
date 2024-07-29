"use strict";
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
exports.getMachine = exports.generateMachine = exports.MachineSchema = void 0;
var ai_1 = require("ai");
var zod_1 = require("zod");
var redisClient_1 = require("../../utils/redisClient");
var model_1 = require("./model");
exports.MachineSchema = zod_1.z.object({
    type: zod_1.z
        .string()
        .describe("The type of machine (e.g. 'server', 'laptop', 'desktop')"),
    org: zod_1.z.string().describe("The organization that owns the machine"),
    os: zod_1.z.string().describe("The operating system of the machine"),
    hardware: zod_1.z.string().describe("The hardware of the machine"),
    hasRoot: zod_1.z.boolean().describe("Whether the user has root access"),
    shell: zod_1.z.string().describe("The shell the user is using"),
    hasGPU: zod_1.z.boolean().describe("Whether the machine has a GPU"),
});
var generateMachine = function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var messages, object;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                messages = [
                    {
                        role: "system",
                        content: "describe the computer associated with the fictional ip address ".concat(args.ip, ". Assume the user is not root unless hasRoot is true or they are on localhost"),
                    },
                    {
                        role: "user",
                        content: args.userPrompt,
                    },
                ];
                return [4 /*yield*/, (0, ai_1.generateObject)({
                        model: model_1.fastModel,
                        schema: exports.MachineSchema,
                        messages: messages,
                    })];
            case 1:
                object = (_a.sent()).object;
                redisClient_1.default.set(args.ip, JSON.stringify(object));
                return [2 /*return*/, object];
        }
    });
}); };
exports.generateMachine = generateMachine;
var getMachine = function (ip) { return __awaiter(void 0, void 0, void 0, function () {
    var hash, machine, newMachine;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Bun.hash(ip).toString()];
            case 1:
                hash = _a.sent();
                return [4 /*yield*/, redisClient_1.default.get(hash)];
            case 2:
                machine = _a.sent();
                if (machine) {
                    return [2 /*return*/, exports.MachineSchema.parse(JSON.parse(machine))];
                }
                return [4 /*yield*/, (0, exports.generateMachine)({
                        ip: ip,
                        userPrompt: "Generate a fictional machine spec based on the IP address. This is a custom super computer used by the airforce.",
                    })];
            case 3:
                newMachine = _a.sent();
                redisClient_1.default.set(hash, JSON.stringify(newMachine));
                return [2 /*return*/, newMachine];
        }
    });
}); };
exports.getMachine = getMachine;
