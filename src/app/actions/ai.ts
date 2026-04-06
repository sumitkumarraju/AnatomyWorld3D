'use server';

import Bytez from "bytez.js";

export async function getOrganClinicalDetails(organName: string) {
  try {
    // 1. Initialize SDK: Use env var if available, otherwise use provided default key
    const apiKey = process.env.BYTEZ_API_KEY || "08a27cede3df772c2307277454e82f28";
    const sdk = new Bytez(apiKey);

    const prompt = `As an expert surgeon and anatomy professor, provide a concise but highly detailed clinical deep dive about the human ${organName}. 
Include:
1. Primary surgical considerations and common procedures.
2. Microscopic/Histological notes.
3. Crucial vascular supply and innervation details.
Format the output as clean HTML without any markdown wrappers or code blocks. Use <strong> tags for emphasis. Keep it under 250 words.`;

    const messages = [{ role: "user", content: prompt }];

    // 2. Try the primary model (GPT-4o) 
    let model = sdk.model("openai/gpt-4o");
    let { error, output } = await model.run(messages);

    // 3. Fallback logic: If GPT-4o hits a quota error, fallback to a free tier model
    if (error) {
      const errorStr = typeof error === 'string' ? error : JSON.stringify(error);
      if (errorStr.includes("429") || errorStr.toLowerCase().includes("quota")) {
        console.warn("GPT-4o 429 Quota Exceeded. Falling back to Meta-Llama-3-8B-Instruct...");
        model = sdk.model("meta-llama/Meta-Llama-3-8B-Instruct");
        
        const fallbackRes = await model.run(messages);
        error = fallbackRes.error;
        output = fallbackRes.output;
      }
    }

    if (error) {
      console.error("Bytez API Error:", error);
      throw new Error(`AI model error: ${JSON.stringify(error)}`);
    }

    // 4. Extract content handle various possible output schemas safely
    let content = "";
    if (typeof output === "string") {
      content = output;
    } else if (output && typeof output === "object") {
      const outObj = output as any;
      if (outObj.content) {
        content = outObj.content;
      } else if (outObj.message?.content) {
        content = outObj.message.content;
      } else if (Array.isArray(output) && output.length > 0 && output[0].message) {
        content = (output[0].message as any).content || "";
      } else {
        content = JSON.stringify(output);
      }
    }

    // Clean up any markdown backticks if the model ignored HTML-only instruction
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
