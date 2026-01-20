import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import {notFoundHandler} from './middlware/notFoundHandler.js';
import { errorHandler } from './middlware/errorHandler.js';
import { logger } from './middlware/logger.js';
import {notesRoutes} from "./routes/notesRoutes.js";
import { connectMongoDB } from './db/connectMongoDB.js';

const app = express();

const PORT=process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors());
app.use(logger);

app.use(notesRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT,()=>{
  console.log(`The server is trying to start on port: ${PORT}`);
});
