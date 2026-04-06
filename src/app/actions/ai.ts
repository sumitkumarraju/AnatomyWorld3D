'use server';

import Bytez from "bytez.js";

// The Bytez AI API key should be stored in Vercel Environment Variables going forward.

export async function getOrganClinicalDetails(organName: string) {
  try {
    const BYTEZ_API_KEY = process.env.BYTEZ_API_KEY || "";
    const sdk = new Bytez(BYTEZ_API_KEY);
    const model = sdk.model("openai/gpt-5.2");

    const prompt = `As an expert surgeon and anatomy professor, provide a concise but highly detailed clinical deep dive about the human ${organName}. 
Include:
1. Primary surgical considerations and common procedures.
2. Microscopic/Histological notes.
3. Crucial vascular supply and innervation details.
Format the output as clean HTML without any markdown wrappers or code blocks. Use <strong> tags for emphasis. Keep it under 250 words.`;

    const { error, output } = await model.run([
      {
        role: "user",
        content: prompt
      }
    ]);

    if (error) {
      console.error("Bytez API Error:", error);
      throw new Error("Failed to fetch AI details");
    }

    // The output from Bytez standard chat completions is usually in output or output[0].message.content
    let content = "";
    if (typeof output === 'string') {
      content = output;
    } else if (Array.isArray(output) && output.length > 0 && output[0].message) {
       content = (output[0].message as any).content || "";
    } else if (output && typeof output === 'object') {
       // Catch-all
       content = JSON.stringify(output);
    }
    
    // Clean up generic markdown backticks if the model ignores the instruction
    content = content.replace(/```html/g, "").replace(/```/g, "").trim();

    return content;
  } catch (err) {
    console.error("AI Generation Error:", err);
    throw new Error("Unable to load clinical details.");
  }
}
