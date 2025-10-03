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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const client = (0, redis_1.createClient)();
const PORT = process.env.PORT || 3000;
app.post('/submit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { problemId, userId, code, language } = req.body;
    try {
        yield client.lPush("submissions", JSON.stringify({ problemId, userId, code, language }));
    }
    catch (err) {
        console.error("Error occured while feeding data to redis at,", err);
    }
    ;
    res.json({
        message: "Submission Receive!"
    });
}));
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log('connected to redis successfully');
        app.listen(PORT, () => {
            console.log(`your server is listening on http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error('failed while connecting to redis', err);
    }
});
startServer();
