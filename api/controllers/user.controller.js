import { errorHandler } from "../utils/errors.js";
import { checkUsername, checkPassword } from "../utils/validator.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import Counterargument from "../models/counterargument.model.js";

export const getSignedInUser = async (req, res) => {
  if (!req.user) {
    next(errorHandler(400, "No user signed in"));
  }

  try {
    const currentUser = await User.findById(req.user.id);
    const { password, ...rest } = currentUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    next(errorHandler(403, "You are not allowed to update this user"));
  }

  // check this for json
  const updatedUsername = req.body.username;
  const updatedPassword = req.body.newpassword;
  const confirmPassword = req.body.confirmpassword;
  const curPassword = req.body.curpassword;

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

    req.body.newpassword = bcryptjs.hashSync(req.body.newpassword, 10);
  }

  try {
    const validUser = await User.findById(req.params.userId);
    const isAutoPassword = validUser.isAutoPassword;

    if (!isAutoPassword && !curPassword) {
      return next(errorHandler(400, "Please fill in current password"));
    }

    if (!isAutoPassword) {
      const validCurPassword = bcryptjs.compareSync(
        curPassword,
        validUser.password
      );
      if (!validCurPassword) {
        return next(errorHandler(400, "Invalid current password!"));
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: validUser.email,
          profilePicture: req.body.profilePicture,
          isAutoPassword:
            !isAutoPassword || req.body.newpassword ? false : true,
          password: req.body.newpassword,
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

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId && !req.user.isAdmin) {
    next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    await Counterargument.deleteMany({ userId: req.params.userId });
    await res.status(200).json("User has been deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};
