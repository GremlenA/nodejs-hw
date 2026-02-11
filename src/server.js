import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { errors } from 'celebrate';
import { connectMongoDB } from './db/connectMongoDB.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import userRoutes from './routes/userRoutes.js';

const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(logger);


app.use(authRoutes);
app.use(notesRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

app.use(userRoutes);

try {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`The server is trying to start on port: ${PORT}`);
  });
} catch (error) {
  console.error("Failed to connect to DB or start server", error);
  process.exit(1);
}
