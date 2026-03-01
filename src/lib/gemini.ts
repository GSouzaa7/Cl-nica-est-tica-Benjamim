import { GoogleGenAI } from "@google/genai";

export const getGeminiModel = (apiKey: string) => {
  const ai = new GoogleGenAI({ apiKey });
  return ai;
};

export const analyzeUI = async (apiKey: string, layoutDescription: string) => {
  try {
    const ai = getGeminiModel(apiKey);
    const prompt = `
      Você é um especialista em UI/UX Sênior. Analise a seguinte descrição estrutural de um layout de aplicação SaaS e sugira 3 melhorias específicas focadas em modernização e usabilidade, mantendo obrigatoriamente a identidade visual laranja (orange-500).
      
      Descrição do Layout:
      ${layoutDescription}
      
      Responda em formato JSON com a seguinte estrutura:
      {
        "issues": ["problema 1", "problema 2", "problema 3"],
        "suggestions": ["sugestão 1", "sugestão 2", "sugestão 3"],
        "overall_score": 0-10
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });
    
    const text = response.text;
    
    // Extract JSON from response (handling potential markdown blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Falha ao analisar resposta da IA");
  } catch (error) {
    console.error("Erro na análise da IA:", error);
    throw error;
  }
};
