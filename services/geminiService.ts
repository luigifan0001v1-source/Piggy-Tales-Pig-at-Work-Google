
import { GoogleGenAI, Type } from "@google/genai";
import { WackyMachine } from "../types";

// Always use process.env.API_KEY directly when initializing the client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Enhanced retry logic specifically tuned for 429 Resource Exhausted errors.
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 5): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isRateLimit = 
        error?.status === 429 || 
        error?.error?.code === 429 ||
        error?.message?.includes('429') || 
        error?.message?.includes('RESOURCE_EXHAUSTED');

      if (isRateLimit && i < maxRetries - 1) {
        const waitTime = Math.pow(2, i + 1) * 1000 + Math.random() * 1000;
        await delay(waitTime);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export const generateWackyMachine = async (theme?: string, isPremium = false): Promise<WackyMachine> => {
  return withRetry(async () => {
    const prompt = `Generate a wacky, over-engineered machine idea strictly following the 'YouTube Season 2: Pigs at Work' style. 
    ${isPremium ? 'This is a PREMIUM ROYAL GOLD blueprint. Make it exceptionally fancy, using gold plating, royal velvet, and excessive luxury components while remaining absurd and clumsy.' : ''}
    Workshop materials: polished wood, metal rivets, pressurized pipes, and unstable TNT.
    ${theme ? `Specific Theme: ${theme}` : ''}
    Return as JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            components: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            hazardLevel: { 
              type: Type.STRING,
              description: "One of: Low, Medium, Extreme, Literal Explosion"
            },
            blueprintCode: { type: Type.STRING },
            rarity: { 
              type: Type.STRING, 
              description: isPremium ? "Must be 'Royal Gold' or 'Legendary'" : "Must be 'Standard'" 
            }
          },
          required: ["name", "description", "components", "hazardLevel", "blueprintCode", "rarity"]
        }
      }
    });

    if (!response.text) throw new Error("Empty response");
    return JSON.parse(response.text) as WackyMachine;
  });
};
