import createHttpError from "http-errors";
import {saveFileToCloudinsry} from "../utils/saveFileToCloudinsry.js";
import { User } from "module";
export const updateUserAvatar = async (req, res) => {
  if(!req.file)
  {
    throw createHttpError(400, "No file");
  }

  const result =await saveFileToCloudinsry(req.file.buffer,req.user._id);
  const updateUser = await User.findOneAndUpdate(
    {_id:req.user._id},
    {avatar:result.secure_url},
     {new:true}
    );
  res.status(200).json({ url:updateUser.avatar });
};
