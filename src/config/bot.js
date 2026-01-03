import TelegramBot from "node-telegram-bot-api";

const createBot = () => {
  if (!process.env.BOT_TOKEN) {
    throw new Error("BOT_TOKEN is missing");
  }

  const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
  });

  console.log("Telegram bot initialized");
  return bot;
};

export default createBot;
