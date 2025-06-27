import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from 'cookie-parser';
import { connectDB } from "./lib/db.js";
import cors from 'cors';
import path from "path";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRoutes);
console.log("Auth routes registered");

app.use("/api/messages", messageRoutes);
console.log("Message routes registered");

console.log("Serving frontend static files from:", path.join(__dirname, "../frontend/dist"));


if (process.env.NODE_ENV === "production") {
    const frontendPath = join(__dirname, "../../frontend/dist");
    app.use(express.static(frontendPath));

    app.get("*", (req, res) => {
        res.sendFile(join(frontendPath, "index.html"));
    });

    console.log("Serving frontend static files from:", frontendPath);
}



server.listen(PORT, () => {
    console.log("server is running at port: " + PORT);
    connectDB();
})