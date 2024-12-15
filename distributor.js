const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
// const ParseResume = require("./ResumeParser.js");
const dotenv = require("dotenv").config();
const GeminiResponse = require('./events/messageCreate.js');

console.log(process.env.GEMINI2)
const genAIInstances = [
  new GoogleGenerativeAI(process.env.GEMINI1),
  new GoogleGenerativeAI(process.env.GEMINI2),
  new GoogleGenerativeAI(process.env.GEMINI3),
  new GoogleGenerativeAI(process.env.GEMINI4),
  new GoogleGenerativeAI(process.env.GEMINI5),
  
];

let currentGenAIIndex = 0;
const maxretries = 3;
const systemInstructions = process.env.SYSTEMINSTRUCTIONS + " Your Name is "+ process.env.NAME + "server name - " + process.env.SERVERNAME + "Owner of the server is  " + process.env.OWNERNAME;

function getNextGenAI() {
  const genAI = genAIInstances[currentGenAIIndex];
  currentGenAIIndex = (currentGenAIIndex + 1) % genAIInstances.length;
  return genAI;
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
        return [
          {
            response: "error fetching response",
            user: user,
          },
        ];
      }
    }
  }
};
