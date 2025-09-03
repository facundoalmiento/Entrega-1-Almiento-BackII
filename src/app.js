import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";

import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import userRouter from "./routes/userRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import sessionsRouter from "./routes/sessionsRouter.js";
import purchaseRouter from "./routes/purchaseRouter.js";

import __dirname from "./utils/constantsUtil.js";
import websocket from "./websocket.js";

import passport from "passport";
import cookieParser from "cookie-parser";
import { iniciarPassport } from "./config/passport.config.js";

dotenv.config();

const app = express();

// DB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/entrega-final-almiento";
mongoose
  .connect(MONGO_URI, { dbName: undefined }) // dbName si querés especificar
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Error MongoDB:", err.message));

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Passport
iniciarPassport();
app.use(passport.initialize());

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/../views");
app.set("view engine", "handlebars");

// Static
app.use(express.static("public"));

// Routers API
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/purchase", purchaseRouter); // 👈 si implementaste checkout

// Vistas
app.use("/", viewsRouter);

// Healthcheck simple
app.get("/", (_req, res) => {
  res.setHeader("content-type", "text/html");
  res.status(200).send("<h1>DALE LOBOo</h1>");
});

// 404 genérico (último)
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler básico
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Server + socket.io
const PORT = process.env.PORT || 3000;
const httpServer = app.listen(PORT, () => {
  console.log(`Start server in PORT ${PORT}`);
});
const io = new Server(httpServer);
websocket(io);
