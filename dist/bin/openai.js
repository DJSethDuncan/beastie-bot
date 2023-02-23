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
exports.dalle = exports.chatgpt = void 0;
var openai_1 = require("openai");
var configuration = new openai_1.Configuration({
    organization: process.env.ORG_ID,
    apiKey: process.env.OPENAI_API_KEY,
});
var openai = new openai_1.OpenAIApi(configuration);
var chatgpt = function (_a) {
    var query = _a.query, _b = _a.model, model = _b === void 0 ? "curie" : _b;
    return __awaiter(void 0, void 0, void 0, function () {
        var models, openAIresponse, e_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    models = {
                        davinci: "text-davinci-003",
                        ada: "text-ada-001",
                        curie: "text-curie-001",
                    };
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4, openai.createCompletion({
                            model: models[model],
                            prompt: query,
                            max_tokens: 500,
                            temperature: 0.8,
                        })];
                case 2:
                    openAIresponse = _c.sent();
                    return [2, openAIresponse.data.choices[0].text];
                case 3:
                    e_1 = _c.sent();
                    console.error(e_1);
                    return [2, "No."];
                case 4: return [2];
            }
        });
    });
};
exports.chatgpt = chatgpt;
var dalle = function (_a) {
    var query = _a.query;
    return __awaiter(void 0, void 0, void 0, function () {
        var openAIImageResponse, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4, openai.createImage({
                            prompt: query,
                            n: 1,
                            size: "512x512",
                        })];
                case 1:
                    openAIImageResponse = _b.sent();
                    return [2, openAIImageResponse.data.data[0].url];
                case 2:
                    e_2 = _b.sent();
                    console.error(e_2);
                    return [2, "No."];
                case 3: return [2];
            }
        });
    });
};
exports.dalle = dalle;
