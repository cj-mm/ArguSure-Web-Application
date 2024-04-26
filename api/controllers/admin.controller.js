import User from "../models/user.model.js";
import Counterargument from "../models/counterargument.model.js";
import { errorHandler } from "../utils/errors.js";

export const getDetailsTotal = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Unauthorized"));
  }
  try {
    const users = await User.find();
    const usersTotal = users.length;
    let savedTotal = 0;
    for (let i = 0; i < usersTotal; i++) {
      const savedField = users[i].saved;
      if (savedField && savedField.length > 0) {
        savedTotal += savedField[0].counterarguments.length;
      }
    }

    const counterargsTotal = await Counterargument.countDocuments();
    const likesTotal = await Counterargument.find({
      liked: "liked",
    }).countDocuments();
    const dislikesTotal = await Counterargument.find({
      liked: "disliked",
    }).countDocuments();
    const likesRatio = Math.round(
      (likesTotal / (likesTotal + dislikesTotal)) * 100
    );
    const dislikesRatio = Math.round(
      (dislikesTotal / (likesTotal + dislikesTotal)) * 100
    );

    const adminPageInfoTotal = {
      usersTotal,
      counterargsTotal,
      savedTotal,
      likesTotal,
      dislikesTotal,
      likesRatio,
      dislikesRatio,
    };

    res.status(200).json(adminPageInfoTotal);
  } catch (error) {
    next(error);
  }
};

export const getDetailsMonth = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Unauthorized"));
  }
  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );
  try {
    const usersPastMonth = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    const counterargsPastMonth = await Counterargument.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    const likesPastMonth = await Counterargument.find({
      liked: "liked",
      updatedAt: { $gte: oneMonthAgo },
    }).countDocuments();
    const dislikesPastMonth = await Counterargument.find({
      liked: "disliked",
      updatedAt: { $gte: oneMonthAgo },
    }).countDocuments();

    const adminPageInfoPastMonth = {
      usersPastMonth,
      counterargsPastMonth,
      likesPastMonth,
      dislikesPastMonth,
    };

    res.status(200).json(adminPageInfoPastMonth);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Unauthorized"));
  }
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 10;
  try {
    let allUsers = [];
    const users = await User.find().skip(startIndex).limit(limit);
    for (let i = 0; i < users.length; i++) {
      let user = {};
      user.userId = users[i]._id;
      user.dateCreated = users[i].createdAt;
      user.profilePic = users[i].profilePicture;
      user.username = users[i].username;
      user.email = users[i].email;
      const userTotalCounterargs = await Counterargument.countDocuments({
        userId: users[i]._id,
      });
      user.totalCounterargs = userTotalCounterargs;
      user.totalTopics = users[i].saved.length;
      allUsers.push(user);
    }
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};
