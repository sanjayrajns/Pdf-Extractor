const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODELS = ["gemini-2.5-flash", "gemini-2.5-pro"];
const PRE_CHECK_MODEL = "gemini-2.5-flash";

module.exports = { ai, MODELS, PRE_CHECK_MODEL };