import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import pino from 'pino-http';
const app = express();

const PORT=process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors());
app.use(pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }));

app.get("/notes",(req,res) =>{
    res.status(200).json({"message": "Retrieved all notes"});
});

app.get("/notes/:noteId",(req,res)=>{
  const {noteId} = req.params;
    res.status(200).json({"message": `Retrieved note with ID: ${noteId}`});
});
//штучна помилка
app.get("/test-error",(res,req)=>{
    throw new Error('Simulated server error');
});

app.use((req,res)=>{
  res.status(404).json({message:"Route not found"});
});

app.use((err,req,res,next)=>{
     console.log("Error",err.message);
     res.status(500).json({message:"Internal Server Error", error: err.message,});


});
app.listen(PORT,()=>{
  console.log(`Сервер пытается запуститься на порту: ${PORT}`);
});
