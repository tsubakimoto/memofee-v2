"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const rss_1 = require("./routes/rss");
const memo_1 = require("./routes/memo");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../../public')));
// API Routes
app.use('/api/rss', rss_1.rssRouter);
app.use('/api/memo', memo_1.memoRouter);
// Serve index.html for all other routes (SPA support)
app.get('*', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../public/index.html'));
});
app.listen(PORT, () => {
    console.log(`MemoFee サーバーが http://localhost:${PORT} で起動しました`);
});
//# sourceMappingURL=index.js.map