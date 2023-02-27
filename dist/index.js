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
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config/config"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/api', index_1.default);
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        app.listen(PORT, () => {
            console.log('Server start on PORT: ', process.env.PORT);
        });
    }
    catch (e) {
        console.log(e);
    }
});
config_1.default.sync().then(() => {
    console.log('Database synced successfully!');
    startApp();
}).catch((err) => {
    console.log("Error", err);
});
exports.default = app;
