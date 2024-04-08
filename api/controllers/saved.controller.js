import User from "../models/user.model.js";
import Counterargument from "../models/counterargument.model.js";
import { errorHandler } from "../utils/errors.js";

export const saveCounterargument = async (req, res, next) => {
  // req.body (save): {userId (string), counterargId (string), selectedTopics (["default"])}
  // req.body (save to): {userId (string), counterargID (string), selectedTopics (["default", list of selectedTopics])}
  if (!req.user) {
    return next(errorHandler(403, "User not signed in"));
  }

  const userId = req.body.userId;
  const counterargId = req.body.counterargId;
  const selectedTopics = req.body.selectedTopics;

  if (!userId || !counterargId || !selectedTopics) {
    return next(errorHandler(403, "Insufficient information"));
  }
  if (req.user.id !== userId) {
    return next(errorHandler(403, "User not allowed to save"));
  }

  try {
    const counterarg = await Counterargument.findById(counterargId);
    if (counterarg.userId !== userId) {
      return next(errorHandler(403, "User not allowed to save"));
    }

    const currentUser = await User.findById(userId);
    let userSaved = currentUser.saved;
    let userSavedTopics = [];
    for (let i = 0; i < userSaved.length; i++) {
      userSavedTopics.push(userSaved[i].topicName);
    }

    // if the user saves the first time
    if (!userSavedTopics.includes("default")) {
      userSaved.push({ topicName: "default", counterarguments: [] });
      userSavedTopics.push("default");
    }
    // check if all selected topics is in the created topics
    for (let i = 0; i < selectedTopics.length; i++) {
      if (!userSavedTopics.includes(selectedTopics[i])) {
        return next(errorHandler(404, "Topic not found"));
      }
    }

    for (let i = 0; i < userSaved.length; i++) {
      if (selectedTopics.includes(userSaved[i].topicName)) {
        // if the topic is selected and it does not contain the counterargument, add it to the topic
        if (!userSaved[i].counterarguments.includes(counterargId)) {
          userSaved[i].counterarguments.push(counterargId);
        }
      } else {
        let index = userSaved[i].counterarguments.indexOf(counterargId);
        // if the topic is not selected and it contains the counterargument, remove it from the topic
        if (index !== -1) {
          userSaved[i].counterarguments.splice(index, 1);
        }
      }
    }

    const userWithUpdatedSaved = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          saved: userSaved,
        },
      },
      { new: true }
    );

    const counterargWithUpdatedSaved = await Counterargument.findByIdAndUpdate(
      counterargId,
      {
        $set: {
          savedTo: selectedTopics,
        },
      },
      { new: true }
    );
    res.status(200).json({ userWithUpdatedSaved, counterargWithUpdatedSaved });
  } catch (error) {
    next(error);
  }
};

export const unSaveCounterargument = async (req, res, next) => {
  // req.body (unsave): {userId (string), counterargID (string), savedTo ([all topics]), removeFrom ([all topics])}
  // req.body (remove from topic): {userId (string), counterargID (string), savedTo ([all topics]), removeFrom ([current topic])}
  if (!req.user) {
    return next(errorHandler(403, "User not signed in"));
  }

  const userId = req.body.userId;
  const counterargId = req.body.counterargId;
  const removeFrom = req.body.removeFrom;
  let savedTo = req.body.savedTo;

  if (!userId || !counterargId || !savedTo || !removeFrom) {
    return next(errorHandler(403, "Insufficient information"));
  }
  if (req.user.id !== userId) {
    return next(errorHandler(403, "User not allowed to unsave"));
  }

  try {
    const counterarg = await Counterargument.findById(counterargId);
    if (counterarg.userId !== userId) {
      return next(errorHandler(403, "User not allowed to save"));
    }

    const currentUser = await User.findById(userId);
    let userSaved = currentUser.saved;
    for (let i = 0; i < userSaved.length; i++) {
      if (removeFrom.includes(userSaved[i].topicName)) {
        let index = userSaved[i].counterarguments.indexOf(counterargId);
        userSaved[i].counterarguments.splice(index, 1);
      }
    }

    const userWithUpdatedSaved = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          saved: userSaved,
        },
      },
      { new: true }
    );

    if (JSON.stringify(savedTo) === JSON.stringify(removeFrom)) {
      savedTo = [];
    } else {
      let index = savedTo.indexOf(removeFrom[0]);
      savedTo.splice(index, 1);
    }
    const counterargWithUpdatedSaved = await Counterargument.findByIdAndUpdate(
      counterargId,
      {
        $set: {
          savedTo: savedTo,
        },
      },
      { new: true }
    );
    res.status(200).json({ userWithUpdatedSaved, counterargWithUpdatedSaved });
  } catch (error) {
    next(error);
  }
};

export const getSavedCounterargs = async (req, res, next) => {};

export const getTopics = async (req, res, next) => {};

export const addTopic = async (req, res, next) => {};

export const renameTopic = async (req, res, next) => {};

export const deleteTopic = async (req, res, next) => {};
