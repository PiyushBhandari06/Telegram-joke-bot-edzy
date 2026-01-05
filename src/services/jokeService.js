import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

const JOKE_API_URL = process.env.JOKE_API_URL;

const fetchRandomJoke = async () => {
  try {
    const response = await axios.get(JOKE_API_URL, {
      timeout: 5000
    });

    const { setup, punchline } = response.data;

    if (!setup || !punchline) {
      throw new Error("Invalid joke format");
    }

    return `${setup}\n\n${punchline}`;

  } catch (error) {
    console.error("Joke fetch failed:", error.message);
    return "Joke service is temporarily unavailable. Try again later.";
    
  }
};

export default fetchRandomJoke;
