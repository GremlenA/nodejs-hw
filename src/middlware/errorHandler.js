
export const errorHandler = (err,req,res) =>{

     res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
     });
};
