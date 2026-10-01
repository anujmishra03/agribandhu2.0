"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
const profile_1 = __importDefault(require("./routes/profile"));
const farms_1 = __importDefault(require("./routes/farms"));
const disease_1 = __importDefault(require("./routes/disease"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Static uploads folder serving
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
// Simple Rate Limiting Middleware
const requestLimits = new Map();
app.use((req, res, next) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    const limitWindow = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 300;
    const record = requestLimits.get(ip);
    if (!record || now > record.resetTime) {
        requestLimits.set(ip, { count: 1, resetTime: now + limitWindow });
        return next();
    }
    record.count += 1;
    if (record.count > maxRequests) {
        return res.status(429).json({ error: 'Too many requests from this IP. Please try again later.' });
    }
    next();
});
// Route Registrations
app.use('/api/auth', auth_1.default);
app.use('/api/profile', profile_1.default);
app.use('/api/farms', farms_1.default);
app.use('/api/disease', disease_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date() });
});
app.listen(PORT, () => {
    console.log(`[AgriBandhu API] Running on http://localhost:${PORT}`);
});
