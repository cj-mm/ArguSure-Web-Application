import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    topicName: { type: String, required: true, unique: true },
    counterarguments: [],
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small/profile-icon-design-free-vector.jpg",
    },
    saved: [topicSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
