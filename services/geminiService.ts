import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSavingPlanAdvice = async (item: string, amount: number, months: number): Promise<string> => {
  try {
    const prompt = `
      I am planning to save ₹${amount} for a "${item}" over the next ${months} months.
      Give me a very short, motivating, 2-sentence breakdown of why this is a good idea and a small tip to stay consistent.
      Keep the tone exciting and encouraging.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Saving is a journey of a thousand steps. Keep going!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Great choice! Consistent small steps lead to big rewards.";
  }
};

export const getCelebrationMessage = async (item: string): Promise<string> => {
   try {
    const prompt = `
      I just completed my savings goal for a "${item}"!
      Write a short, enthusiastic congratulatory message (max 20 words).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Congratulations on reaching your goal!";
  } catch (error) {
    return "Congratulations! You did it!";
  }
}