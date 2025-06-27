import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { createSocketServer } from "./lib/socket.js";

// Required for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const PORT = process.env.PORT;

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

// Routes
app.use("/api/auth", authRoutes);
console.log("✅ Auth routes registered");
app.use("/api/messages", messageRoutes);
console.log("✅ Message routes registered");

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    const distPath = path.join(__dirname, "../frontend/dist");
    app.use(express.static(distPath));
    console.log("Serving frontend static files from:", distPath);

    app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
    });
}

// Start server and DB
const { server } = createSocketServer(app);

server.listen(PORT, () => {
    console.log("🚀 Server is running on PORT:", PORT);
    connectDB();
});
