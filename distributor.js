const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
// const ParseResume = require("./ResumeParser.js");
const dotenv = require("dotenv").config();
const GeminiResponse = require("./events/messageCreate.js");

console.log(process.env.GEMINI2);
const genAIInstances = [
  new GoogleGenerativeAI(process.env.GEMINI1),
  new GoogleGenerativeAI(process.env.GEMINI2),
  new GoogleGenerativeAI(process.env.GEMINI3),
  new GoogleGenerativeAI(process.env.GEMINI4),
  new GoogleGenerativeAI(process.env.GEMINI5),
];

let currentGenAIIndex = 0;
const maxretries = 3;
const systemInstructions =
  process.env.SYSTEMINSTRUCTIONS +
  " Your Name is " +
  process.env.NAME +
  "You are in this discord server - " +
  process.env.SERVERNAME;

function getNextGenAI() {
  let attempts = 0;
  const maxAttempts = genAIInstances.length;
  let selectedGenAI = null;

  // First pass: Try to find an API key that is not in use
  while (attempts < maxAttempts) {
    const genAI = genAIInstances[currentGenAIIndex];
    currentGenAIIndex = (currentGenAIIndex + 1) % genAIInstances.length;

    if (!genAI.inUse) {
      genAI.inUse = true; // Mark the API key as in use
      return genAI;
    }

    attempts++;
  }

  // Second pass: If all API keys are in use, select any API key
  currentGenAIIndex = (currentGenAIIndex + 1) % genAIInstances.length;
  selectedGenAI = genAIInstances[currentGenAIIndex];
  return selectedGenAI;
}

module.exports = async function GenerateMessage(message, user) {
  for (let attempts = 0; attempts < maxretries; attempts++) {
    try {
      console.log("retry", attempts);
      const genAI = getNextGenAI();
      const result = await GeminiResponse(
        message,
        genAI,
        systemInstructions,
        user
      );
      return result;
    } catch (error) {
      if (error) {
        console.log("retry error ", error);
        console.log(`Retry attempt ${attempts + 1} due to error`);
        continue;
      } else {
        console.error("Error generating message:", error);
        return { response: "I encountered an issue. Please try again later." };
      }
    }
  }
};
