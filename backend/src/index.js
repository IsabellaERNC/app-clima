import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import climaRoutes from "./routes/clima.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/clima", climaRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend App de Clima funcionando ✅" });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
