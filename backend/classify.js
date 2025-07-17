// classify.js
require("dotenv").config({ path: "./api.env" });
const { Configuration, OpenAIApi } = require("openai");
const chokidar = require("chokidar");
const path = require("path");
const fs = require("fs");

const watchPath = path.resolve(__dirname, "../watched");
const outputPath = path.resolve(__dirname, "../sorted");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Upewnij się, że katalogi istnieją
if (!fs.existsSync(watchPath)) fs.mkdirSync(watchPath);
if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);

async function classifyFilename(filename) {
  const prompt = `Jaką kategorię najlepiej przypisać plikowi o nazwie "${filename}"? Odpowiedz jednym słowem – np. "Muzyka", "Zdjęcia", "Kod", "Dokumenty", "Video", "Audio", "CV", itp.`;

  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.3,
    messages: [{ role: "user", content: prompt }]
  });

  return res.data.choices[0].message.content;
}
