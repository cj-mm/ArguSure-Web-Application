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

    res.status(200).json({ userWithUpdatedSaved });
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
    res.status(200).json({ userWithUpdatedSaved });
  } catch (error) {
    next(error);
  }
};

export const addTopic = async (req, res, next) => {
  // req.body: {userId (string), topicName (string)}
  if (!req.user) {
    return next(errorHandler(403, "User not signed in"));
  }

  if (!req.body.userId || !req.body.topicName.trim()) {
    return next(errorHandler(403, "Insufficient Information"));
  }

  try {
    const currentUser = await User.findById(req.body.userId);
    let userSaved = currentUser.saved;
    if (userSaved.length === 0) {
      userSaved.push({
        topicName: "default",
        counterarguments: [],
      });
    }

    let userSavedTopics = [];
    for (let i = 0; i < userSaved.length; i++) {
      userSavedTopics.push(userSaved[i].topicName.toLowerCase());
    }

    if (userSavedTopics.includes(req.body.topicName.toLowerCase())) {
      return next(errorHandler(400, "Topic already exists"));
    }

    const slug = req.body.topicName
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    userSaved.push({
      topicName: req.body.topicName,
      counterarguments: [],
      slug: slug,
    });
    const userWithUpdatedSaved = await User.findByIdAndUpdate(
      req.body.userId,
      {
        $set: {
          saved: userSaved,
        },
      },
      { new: true }
    );
    res.status(200).json({ userWithUpdatedSaved });
  } catch (error) {
    next(error);
  }
};

const mapOrder = (array, order, key) => {
  array.sort(function (a, b) {
    let A = a[key],
      B = b[key];

    if (order.indexOf(A) < order.indexOf(B)) {
      return 1;
    } else {
      return -1;
    }
  });

  return array;
};

export const getSavedCounterargs = async (req, res, next) => {
  // req.query: topicName: string
  if (!req.user) {
    return next(errorHandler(403, "User not signed in"));
  }

  if (!req.query.topicName) {
    return next(errorHandler(400, "Topic name not provided"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;

    const currentUser = await User.findById(req.user.id);
    let counterargs = [];
    for (let i = 0; i < currentUser.saved.length; i++) {
      if (currentUser.saved[i].topicName === req.query.topicName) {
        counterargs = currentUser.saved[i].counterarguments;
        break;
      }
    }

    const topicCounterargs = await Counterargument.find({
      _id: { $in: counterargs },
      ...(req.query.searchTerm && {
        $or: [
          { inputClaim: { $regex: req.query.searchTerm, $options: "i" } },
          { summary: { $regex: req.query.searchTerm, $options: "i" } },
          { body: { $regex: req.query.searchTerm, $options: "i" } },
          { source: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .skip(startIndex)
      .limit(limit);

    const orderedTopicCounterargs = mapOrder(
      topicCounterargs,
      counterargs,
      "_id"
    );
    res.status(200).json(orderedTopicCounterargs);
  } catch (error) {
    next(error);
  }
};

export const renameTopic = async (req, res, next) => {
  // req.body: curTopicName (string), newTopicName (string)
  if (!req.user) {
    return next(errorHandler(403, "User not signed in"));
  }

  if (!req.body.curTopicName || !req.body.newTopicName) {
    return next(errorHandler(400, "Empty value is not allowed"));
  }

  try {
    const currentUser = await User.findById(req.user.id);
    let userSaved = currentUser.saved;

    let userSavedTopics = [];
    let topicExists = false;
    for (let i = 0; i < userSaved.length; i++) {
      userSavedTopics.push(userSaved[i].topicName.toLowerCase());
      if (
        userSaved[i].topicName.toLowerCase() ===
        req.body.curTopicName.toLowerCase()
      ) {
        topicExists = true;
      }
    }

    if (!topicExists) {
      return next(errorHandler(400, "Selected topic does not exist"));
    }

    if (
      userSavedTopics.includes(req.body.newTopicName.toLowerCase()) &&
      req.body.curTopicName.toLowerCase() !==
        req.body.newTopicName.toLowerCase()
    ) {
      return next(errorHandler(400, "Topic already exists"));
    }

    const slug = req.body.newTopicName
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    for (let i = 0; i < userSaved.length; i++) {
      if (userSaved[i].topicName === req.body.curTopicName) {
        userSaved[i].topicName = req.body.newTopicName;
        userSaved[i].slug = slug;
        break;
      }
    }

    const userWithUpdatedSaved = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          saved: userSaved,
        },
      },
      { new: true }
    );
    res.status(200).json(userWithUpdatedSaved);
  } catch (error) {
    next(error);
  }
};

export const deleteTopic = async (req, res, next) => {};
