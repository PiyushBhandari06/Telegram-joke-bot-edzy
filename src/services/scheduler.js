import User from "../models/User.js";
import fetchRandomJoke from "./jokeService.js";

const CHECK_INTERVAL_MS = 30 * 1000; // 30 seconds

const startScheduler = (bot) => {
  setInterval(async () => {
    const now = new Date();

    const users = await User.find({ isEnabled: true });

    for (const user of users) {
      const lastSent = user.lastSentAt;
      const freqMs = user.frequency * 60 * 1000;

      const isDue =
        !lastSent || now - new Date(lastSent) >= freqMs;

      if (!isDue) continue;

      try {
        const joke = await fetchRandomJoke();
        await bot.sendMessage(user.chatId, joke);

        user.lastSentAt = now;
        await user.save();
      } catch (err) {
        console.error(
          `Failed to send joke to ${user.chatId}:`,
          err.message
        );

        // Bot blocked or chat invalid → disable user
        user.isEnabled = false;
        await user.save();
      }
    }
  }, CHECK_INTERVAL_MS);

  console.log("Scheduler started");
};

export default startScheduler;
