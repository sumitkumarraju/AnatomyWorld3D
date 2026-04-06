'use server';

export async function getOrganClinicalDetails(organName: string) {
  try {
    const BYTEZ_API_KEY = process.env.BYTEZ_API_KEY;

    if (!BYTEZ_API_KEY) {
      throw new Error("AI service is not configured. BYTEZ_API_KEY is missing.");
    }

    const prompt = `As an expert surgeon and anatomy professor, provide a concise but highly detailed clinical deep dive about the human ${organName}. 
Include:
1. Primary surgical considerations and common procedures.
2. Microscopic/Histological notes.
3. Crucial vascular supply and innervation details.
Format the output as clean HTML without any markdown wrappers or code blocks. Use <strong> tags for emphasis. Keep it under 250 words.`;

    const response = await fetch("https://api.bytez.com/models/v2/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Key ${BYTEZ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Bytez API HTTP error:", response.status, errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    let content = data?.choices?.[0]?.message?.content || "";

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
