import { errorHandler } from "../utils/errors.js";
import { checkUsername, checkPassword } from "../utils/validator.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const test = (req, res) => {
  res.json({ message: "API is working!" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    next(errorHandler(403, "You are not allowed to update this user"));
  }

  // check this for json
  const updatedUsername = req.body.username;
  const updatedPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  const curPassword = req.body.curPassword;

  if (updatedUsername) {
    const usernameResult = checkUsername(updatedUsername);
    if (usernameResult !== "Success") {
      return next(errorHandler(400, usernameResult));
    }
  }

  if (updatedPassword) {
    const passwordResult = checkPassword(updatedPassword);
    if (passwordResult !== "Success") {
      return next(errorHandler(400, passwordResult));
    }

    if (updatedPassword !== confirmPassword) {
      return next(errorHandler(400, "Passwords do not match"));
    }

    req.body.newPassword = bcryptjs.hashSync(req.body.newPassword, 10);
  }

  try {
    if (!curPassword) {
      return next(errorHandler(400, "Please fill in current password"));
    }

    const validUser = await User.findById(req.params.userId);
    const validCurPassword = bcryptjs.compareSync(
      curPassword,
      validUser.password
    );
    if (!validCurPassword) {
      return next(errorHandler(400, "Invalid current password!"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.newPassword,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
