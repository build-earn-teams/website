import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import collaboratorRouter from "./routes/collaboratorRoute.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (_, res) => {
  res.send("API is running...");
});

app.use('/collaborator',collaboratorRouter)



app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
