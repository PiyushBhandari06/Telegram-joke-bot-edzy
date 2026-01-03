import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
      unique: true
    },
    isEnabled: {
      type: Boolean,
      default: true
    },
    frequency: {
      type: Number,
      default: 1, // minutes
      min: 1,
      max: 1440
    },
    lastSentAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;
