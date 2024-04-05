import User from "../models/user.model.js";
import Counterargument from "../models/counterargument.model.js";

export const saveCounterargument = async (req, res, next) => {
  // req.body (save): {userId (string), counterargID (string), topics (["default"])}
  // req.body (save to): {userId (string), counterargID (string), topics ("default", [list of topics])}

  if (!req.user) {
    return next(errorHandler(403, "User not signed in"));
  }

  if (req.user.id !== req.body.userId) {
    return next(errorHandler(403, "User not allowed to save"));
  }
};

export const unSaveCounterargument = async (req, res, next) => {
  // req.body (unsave): {userId (string), counterargID (string), topics (["default"])}
  // req.body (remove from playlist): {userId (string), counterargID (string), topics ("default", [list of topics])}
};

export const getSavedCounterargs = async (req, res, next) => {};

export const addTopic = async (req, res, next) => {};

export const renameTopic = async (req, res, next) => {};

export const deleteTopic = async (req, res, next) => {};
