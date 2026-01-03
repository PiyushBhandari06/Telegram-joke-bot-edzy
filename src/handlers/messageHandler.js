import User from "../models/User.js";

const messageHandler = async (bot, msg) => {
  const chatId = msg.chat.id.toString();
  const text = msg.text?.trim().toUpperCase();

  // Ignore non-text messages
  if (!text) return;

  let user = await User.findOne({ chatId });
  if (!user) {
    user = await User.create({ chatId });
  }

  if (text === "/START") {
    user.isEnabled = true;
    await user.save();
    return bot.sendMessage(
      chatId,
      "Joke delivery started. Default frequency: 1 minute."
    );
  }

  if (text === "ENABLE") {
    user.isEnabled = true;
    await user.save();
    return bot.sendMessage(chatId, "Joke delivery resumed.");
  }

  if (text === "DISABLE") {
    user.isEnabled = false;
    await user.save();
    return bot.sendMessage(chatId, "Joke delivery paused.");
  }

  if (text.startsWith("SET")) {
    const parts = text.split(" ");
    const n = parseInt(parts[1], 10);

    if (!n || n < 1 || n > 1440) {
      return bot.sendMessage(
        chatId,
        "Invalid frequency. Use: SET <minutes> (1–1440)"
      );
    }

    user.frequency = n;
    await user.save();
    return bot.sendMessage(
      chatId,
      `Frequency updated to ${n} minutes.`
    );
  }

  // Unknown command — ignore silently
};

export default messageHandler;
