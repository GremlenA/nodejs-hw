import cloudinary from "cloudinary";
import { Readable } from "nodemailer/lib/xoauth2";

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveFileToCloudinsry = async (buffer, userId) => {
return new Promise((resolve,reject) =>
{
 const uploadStream = cloudinary.UploadStream.upload_stream(
  {
    folder: "",
    resource_type:"image",
    public_id: `avatar_${userId}`,
    overwrite:true,
  },
  (err,result)=>{err ? reject(err) : resolve(result);},);


  Readable.from(buffer).pipe(uploadStream);
});
};
