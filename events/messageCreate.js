const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const dotenv = require("dotenv").config();

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];
async function GeminiResponse(message, genAI, systemInstructions, user) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemInstructions,
    safetySettings: safetySettings,
  });

  const generationConfig = {
    temperature: 1.6,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
      type: "object",
      properties: {
        response: {
          type: "string",
        },
      },
    },
  };
  const chatSession = model.startChat({
    generationConfig,
  });
  console.log("user", user.username);

  const result = await chatSession.sendMessage(
    message + `-- message by discord user ${user.username}`
  );
  console.log("result", JSON.parse(result.response.text()));
  return JSON.parse(result.response.text());
}

module.exports = GeminiResponse;
