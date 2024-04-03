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
