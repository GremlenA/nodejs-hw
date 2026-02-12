import createHttpError from "http-errors";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { User } from "../models/user.js";

export const updateUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError(400, "No file uploaded");
    }

    const result = await saveFileToCloudinary(req.file.buffer);

    const updateUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { avatar: result.secure_url },
      { new: true }
    );

    res.status(200).json({
      status: 200,
      message: "Successfully updated user avatar",
      data: {
        url: updateUser.avatar,
      }
    });

  } catch (error) {
    next(error);
  }
};
