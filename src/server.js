import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import {notFoundHandler} from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import notesRoutes from "./routes/notesRoutes.js";
import { connectMongoDB } from './db/connectMongoDB.js';
import { errors } from 'celebrate';
import { registerUser } from './controllers/authController.js';
import  router from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

const PORT=process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(logger);

app.use(registerUser);
app.use(router);
app.use(notesRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT,()=>{
  console.log(`The server is trying to start on port: ${PORT}`);
});
