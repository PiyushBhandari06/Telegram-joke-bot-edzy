import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import createBot from "./config/bot.js";
import messageHandler from "./handlers/messageHandler.js";
import startScheduler from "./services/scheduler.js";

console.log("BOT_TOKEN loaded:", !!process.env.BOT_TOKEN);
console.log("MONGODB_URI loaded:", !!process.env.MONGODB_URI);

await connectDB();

const bot = createBot();

bot.on("message", (msg) => {
  messageHandler(bot, msg);
});

startScheduler(bot);
