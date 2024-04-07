import mongoose from "mongoose";

const counterargumentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    inputClaim: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    liked: {
      type: String,
      default: "none",
      enum: ["none", "liked", "disliked"],
      required: true,
    },
    savedTo: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Counterargument = mongoose.model(
  "Counterargument",
  counterargumentSchema
);

export default Counterargument;
