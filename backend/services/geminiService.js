const { ai, MODELS, PRE_CHECK_MODEL } = require("../config/aiConfig");
const { labReportSchema } = require("../utils/schemas");

const WAIT = (ms) => new Promise((r) => setTimeout(r, ms));


async function performPreliminaryCheck(imagePart) {
  const prompt = `Analyze this document. Does it contain structured, quantitative laboratory data (numbers, units, reference ranges) from a clinical analysis? The document must contain key medical keywords like **HDL**, **LDL**, **Lipid profile**, **CBC**, or **Hemoglobin**. Reject documents that only contain qualitative information or obviously non-standard mock data.
  Answer strictly with 'YES' or 'NO' only.`;

  try {
    const response = await ai.models.generateContent({
      model: PRE_CHECK_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }, imagePart] }],
    });
    const answer = response.text.trim().toUpperCase();
    return answer === "YES";
  } catch (err) {
    console.error("Preliminary check error:", err.message);
    return false;
  }
}

// 2. Core Extraction with Retries
async function extractData(imagePart) {
  const MAX_RETRIES = 3;
  const prompt = "Extract lab report values accurately.";
  let data = null;

  for (const model of MODELS) {
    try {
      data = await _safeExtract(model, prompt, imagePart, MAX_RETRIES);
      if (data) return data; // Success
    } catch (e) {
      console.log(`Error with model ${model}. Falling back...`);
    }
  }
  throw new Error(`Gemini extraction failed on all models.`);
}

// Helper for the retry loop (private to this file)
async function _safeExtract(model, prompt, imagePart, maxRetries) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt} using ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: prompt }, imagePart] }],
        config: {
          systemInstruction: "Extract heading, test_name, result, unit, reference interval. Return valid JSON only.",
          responseMimeType: "application/json",
          responseSchema: labReportSchema,
        },
      });
      return JSON.parse(response.text);
    } catch (err) {
      // Error handling logic (simplified for brevity, similar to your original code)
      if (err.message.includes("unavailable") || err.message.includes("503")) {
        await WAIT(1000 * attempt);
        continue;
      }
      if (attempt === maxRetries) throw err;
    }
  }
}

module.exports = { performPreliminaryCheck, extractData };