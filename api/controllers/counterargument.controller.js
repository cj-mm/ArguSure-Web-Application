import { errorHandler } from "../utils/errors.js";
import Counterargument from "../models/counterargument.model.js";

export const saveCounterarg = async (req, res, next) => {
  if (!req.user) {
    return next(errorHandler(403, "Counterargument saving failed"));
  }

  if (
    !req.body.inputClaim ||
    !req.body.summary ||
    !req.body.body ||
    !req.body.source
  ) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  const newCounterarg = new Counterargument({
    ...req.body,
    userId: req.user.id,
    liked: "none",
  });

  try {
    const savedCounterarg = await newCounterarg.save();
    res.status(201).json(savedCounterarg);
  } catch (error) {
    next(error);
  }
};

export const likeDislike = async (req, res, next) => {
  if (!req.user) {
    return next(errorHandler(403, "User not signed in"));
  }

  if (req.user.id !== req.body.userId) {
    return next(errorHandler(403, "User not allowed to like/dislike"));
  }

  if (
    req.body.liked !== "none" &&
    req.body.liked !== "liked" &&
    req.body.liked !== "disliked"
  ) {
    return next(errorHandler(403, "Invalid value"));
  }

  try {
    const counterarg = await Counterargument.findById(req.body._id);
    if (!counterarg) {
      return next(errorHandler(404, "Counterargument not found"));
    }

    const updatedCounterarg = await Counterargument.findByIdAndUpdate(
      req.body._id,
      {
        $set: {
          liked: req.body.liked,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedCounterarg);
  } catch (error) {
    next(error);
  }
};

export const getLikes = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;

    const likedCounterargs = await Counterargument.find({
      userId: req.user.id,
      liked: "liked",
      ...(req.query.searchTerm && {
        $or: [
          { inputClaim: { $regex: req.query.searchTerm, $options: "i" } },
          { summary: { $regex: req.query.searchTerm, $options: "i" } },
          { body: { $regex: req.query.searchTerm, $options: "i" } },
          { source: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: "desc" })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json(likedCounterargs);
  } catch (error) {
    next(error);
  }
};

export const getDislikes = async (req, res, next) => {
  try {
    const dislikedCounterargs = await Counterargument.find({
      userId: req.user.id,
      liked: "disliked",
      ...(req.query.searchTerm && {
        $or: [
          { claim: { $regex: req.query.searchTerm, $options: "i" } },
          { summary: { $regex: req.query.searchTerm, $options: "i" } },
          { body: { $regex: req.query.searchTerm, $options: "i" } },
          { source: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    }).sort({ updatedAt: "desc" });
    res.status(200).json(dislikedCounterargs);
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const history = await Counterargument.find({
      userId: req.user.id,
      ...(req.query.searchTerm && {
        $or: [
          { claim: { $regex: req.query.searchTerm, $options: "i" } },
          { summary: { $regex: req.query.searchTerm, $options: "i" } },
          { body: { $regex: req.query.searchTerm, $options: "i" } },
          { source: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    }).sort({ updatedAt: "desc" });
    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};
