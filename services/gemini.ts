
import { GoogleGenAI, Type } from "@google/genai";

export const generateGroomingCaption = async (description: string) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Pet grooming social media manager. 
    Task: Generate a creative, catchy social media caption (Instagram style) for a grooming "Before & After" post.
    Details: ${description}
    Output requirements: 
    - Engaging intro with emojis.
    - Mention the dog's breed/name if provided.
    - Highlight the specific style (e.g., Teddy Bear cut, summer cut).
    - Include 3-5 relevant hashtags.
    - Language: Korean.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        responseMimeType: 'text/plain'
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "우와! 이 변신 좀 보세요! 🐶✂️ 벨라가 오늘 풀 코스 스파를 받고 슈퍼스타처럼 변신했어요. 귀여운 눈망울을 돋보이게 하기 위해 테디베어 컷으로 미용했답니다. 오늘 미용하는 동안 너무 얌전하고 착했어요! ❤️";
  }
};
