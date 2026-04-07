'use server';

// Multi-provider AI: Gemini (primary) → Bytez (fallback) → Static fallback

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function buildPrompt(organName: string) {
  return `As an expert surgeon and anatomy professor, provide a concise but highly detailed clinical deep dive about the human ${organName}. 
Include:
1. Primary surgical considerations and common procedures.
2. Microscopic/Histological notes.
3. Crucial vascular supply and innervation details.
Format the output as clean HTML without any markdown wrappers or code blocks. Use <strong> tags for emphasis. Keep it under 250 words.`;
}

function cleanContent(raw: string): string {
  let c = raw;
  c = c.replace(/```html\n?/g, '').replace(/```\n?/g, '');
  c = c.replace(/<think>[\s\S]*?<\/think>/gi, '');
  return c.trim();
}

async function tryGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 600,
          temperature: 0.7,
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.warn(`Gemini returned ${res.status}: ${body}`);
      return null;
    }

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err: any) {
    console.warn('Gemini failed:', err?.message);
    return null;
  }
}

async function tryBytez(prompt: string): Promise<string | null> {
  const apiKey = process.env.BYTEZ_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch('https://api.bytez.com/models/v2/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen3-4B',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

export async function getOrganClinicalDetails(organName: string) {
  const prompt = buildPrompt(organName);

  let content = await tryGemini(prompt);
  if (!content) content = await tryBytez(prompt);
  if (!content) return getStaticFallback(organName);

  const cleaned = cleanContent(content);
  return cleaned || getStaticFallback(organName);
}

function getStaticFallback(organName: string): string {
  const fallbacks: Record<string, string> = {
    heart: `<strong>Surgical Considerations:</strong> Approached via median sternotomy for CABG and valve replacements. Critical landmarks include the LAD and circumflex arteries.<br/><br/><strong>Histology:</strong> Branching striated fibers with intercalated discs. Endocardium, myocardium, and epicardium layers.<br/><br/><strong>Vascular Supply:</strong> RCA supplies right ventricle and SA/AV nodes. LCA divides into LAD and circumflex. <strong>Innervation:</strong> Sympathetic (T1-T5) increases rate; parasympathetic via vagus decreases rate.`,
    brain: `<strong>Surgical Considerations:</strong> Access via craniotomy with stereotactic guidance. Eloquent cortex mapped via awake craniotomy.<br/><br/><strong>Histology:</strong> Six-layered cortex. Gray matter contains neuronal cell bodies; white matter has myelinated axons.<br/><br/><strong>Vascular Supply:</strong> Internal carotids (anterior circulation), vertebral/basilar (posterior). Circle of Willis provides collateral flow. <strong>Innervation:</strong> Brain has no pain receptors; meninges innervated by trigeminal branches.`,
    lungs: `<strong>Surgical Considerations:</strong> Lobectomy, pneumonectomy, and VATS procedures. Right lung has 3 lobes, left has 2.<br/><br/><strong>Histology:</strong> Airways transition from pseudostratified epithelium to type I/II pneumocytes in alveoli.<br/><br/><strong>Vascular Supply:</strong> Pulmonary arteries for gas exchange; bronchial arteries for parenchyma. <strong>Innervation:</strong> Vagus (bronchoconstriction), sympathetic T2-T5 (bronchodilation).`,
    liver: `<strong>Surgical Considerations:</strong> Couinaud's 8-segment anatomy guides hepatectomy. Porta hepatis contains portal vein, hepatic artery, and bile duct.<br/><br/><strong>Histology:</strong> Hepatocytes in plates around central veins. Kupffer cells line sinusoids.<br/><br/><strong>Vascular Supply:</strong> Dual supply — hepatic artery (25%) and portal vein (75%). <strong>Innervation:</strong> Hepatic plexus; vagus stimulates bile secretion.`,
    kidneys: `<strong>Surgical Considerations:</strong> Nephrectomy, pyeloplasty, transplantation. Hilum order: vein, artery, pelvis.<br/><br/><strong>Histology:</strong> Nephron is the functional unit — glomerulus, proximal/distal tubules, collecting ducts.<br/><br/><strong>Vascular Supply:</strong> Renal arteries from aorta at L1-L2. <strong>Innervation:</strong> Renal plexus (T10-L1 sympathetic).`,
  };
  const key = organName.toLowerCase();
  return fallbacks[key] || `<strong>${organName}</strong> — Clinical details temporarily unavailable. Please try again shortly.`;
}
