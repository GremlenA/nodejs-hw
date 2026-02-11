 import multer from "multer";

 export const upload = multer({
  storage:multer.memoryStorage(),
limits:{
  fileSize:2*1024*1024
},
fileFilter:()=>(req,file,callback) =>{
  const fileTapes = ("img/jpeg","image/png");
  if(fileTapes.includes(file.mimetype))
  {
    callback(null,true);
  }
  else
  {
    callback(new Error("Invalid file type"));
  }
}

 });
