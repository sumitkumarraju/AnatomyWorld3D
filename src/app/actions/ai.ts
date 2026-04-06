'use server';

import Bytez from "bytez.js";

export async function getOrganClinicalDetails(organName: string) {
  try {
    const BYTEZ_API_KEY = process.env.BYTEZ_API_KEY;

    if (!BYTEZ_API_KEY) {
      throw new Error("AI service is not configured. BYTEZ_API_KEY is missing.");
    }

    const sdk = new Bytez(BYTEZ_API_KEY);
    const model = sdk.model("openai/gpt-4o");

    const prompt = `As an expert surgeon and anatomy professor, provide a concise but highly detailed clinical deep dive about the human ${organName}. 
Include:
1. Primary surgical considerations and common procedures.
2. Microscopic/Histological notes.
3. Crucial vascular supply and innervation details.
Format the output as clean HTML without any markdown wrappers or code blocks. Use <strong> tags for emphasis. Keep it under 250 words.`;

    const { error, output } = await model.run([
      {
        role: "user",
        content: prompt,
      },
    ]);

    if (error) {
      console.error("Bytez API Error:", JSON.stringify(error));
      throw new Error(`AI model error: ${JSON.stringify(error)}`);
    }

    // Extract content from Bytez output format
    let content = "";
    if (typeof output === "string") {
      content = output;
    } else if (Array.isArray(output) && output.length > 0 && output[0].message) {
      content = (output[0].message as any).content || "";
    } else if (output && typeof output === "object") {
      content = JSON.stringify(output);
    }

    // Clean up any markdown backticks if the model ignores the instruction
    content = content.replace(/```html/g, "").replace(/```/g, "").trim();

    if (!content) {
      throw new Error("AI returned an empty response.");
    }

    return content;
  } catch (err: any) {
    console.error("AI Generation Error:", err?.message || err);
    throw new Error(err?.message || "Unable to load clinical details.");
  }
}
