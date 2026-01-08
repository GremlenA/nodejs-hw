import express from 'express';
import 'dotenv/config';

const app = express();

const PORT=process.env.PORT ?? 3000;

app.get("/notes",(req,res) =>{
    res.status(200).json({"message": "Retrieved all notes"});
});

app.get("/notes/:noteId",(req,res)=>{
  const {noteId} = req.params;
    res.status(200).json({"message": `Retrieved note with ID: ${noteId}`});
});

app.listen(PORT,()=>{
  console.log(`Сервер пытается запуститься на порту: ${PORT}`);
});


