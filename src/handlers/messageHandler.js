import User from "../models/User.js";

const HELP_MESSAGE = `
🤖 Joke Bot - How to use

/start   → Start joke delivery
ENABLE   → Resume jokes
DISABLE  → Pause jokes
SET n    → Set frequency in minutes (e.g. SET 5)
HELP     → Show this help message

Commands are case-insensitive.
`;

const messageHandler = async (bot, msg) => {
  const chatId = msg.chat.id.toString();
  const text = msg.text?.trim().toUpperCase();

  // Ignore non-text messages
  if (!text) return;

  const normalizedText = text.toUpperCase();

  let user = await User.findOne({ chatId });

  const isFirstTimeUser = !user;

  if (!user) {
    user = await User.create({ chatId });
  }

  // First-time user → send HELP automatically
  if (isFirstTimeUser || normalizedText === "/START") {
    user.isEnabled = true;
    await user.save();

    return bot.sendMessage(chatId, HELP_MESSAGE);
  }

  if (normalizedText === "HELP") {
    return bot.sendMessage(chatId, HELP_MESSAGE);
  }

  if (normalizedText === "ENABLE") {
    if (user.isEnabled) {
      return bot.sendMessage(chatId, "Joke delivery is already active.");
    }
    user.isEnabled = true;
    await user.save();
    return bot.sendMessage(chatId, "Joke delivery resumed.");
  }

  if (normalizedText === "DISABLE") {
    if (!user.isEnabled) {
      return bot.sendMessage(chatId, "Joke delivery is already paused.");
    }
    user.isEnabled = false;
    await user.save();
    return bot.sendMessage(chatId, "Joke delivery paused.");
  }

  if (normalizedText.startsWith("SET")) {
    const parts = normalizedText.split(" ");
    const n = parseInt(parts[1], 10);

    if (!n || n < 1 || n > 1440) {
      return bot.sendMessage(chatId, HELP_MESSAGE);
    }

    user.frequency = n;
    await user.save();
    return bot.sendMessage(chatId, `Frequency updated to ${n} minutes.`);
  }

  // Unknown command — ignore silently
  return bot.sendMessage(chatId, HELP_MESSAGE);
};

export default messageHandler;
