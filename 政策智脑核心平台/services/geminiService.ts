import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ImageSize } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Chat with Gemini using gemini-3-pro-preview
 */
export const createChatStream = async (
  message: string, 
  history: { role: string; parts: { text: string }[] }[]
) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history,
      config: {
        systemInstruction: "你是一个工信部（工业和信息化部）的专家级政策分析助手。请提供关于产业政策、法规和数据治理的清晰、简洁的摘要和回答。请始终使用中文回答。",
      }
    });

    const result = await chat.sendMessageStream({ message });
    return result;
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

/**
 * Generate Images using gemini-3-pro-image-preview
 */
export const generatePolicyImage = async (prompt: string, size: ImageSize): Promise<string | null> => {
  try {
    // Determine if we need to request high quality key first if implementing full auth flow, 
    // but per instructions we assume process.env.API_KEY is available and valid for this model 
    // or handled by the environment.
    
    // Note: The prompt asks for gemini-3-pro-image-preview.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          imageSize: size, // '1K', '2K', or '4K'
          aspectRatio: '16:9' // Good for presentation slides
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;

  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

/**
 * Mock function to simulate AI Agent processing (Tongyuan/Dify)
 * In a real app, this might call an external agent API.
 * We use Gemini here to simulate the "Cleaning" description.
 */
export const simulateDataCleaning = async (rawText: string): Promise<string> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `作为一个数据治理智能体，请清理并结构化以下政策文本元数据，生成一个JSON摘要（仅返回纯文本摘要，不需要实际的JSON格式代码块，用中文回答）: ${rawText}`,
        });
        return response.text || "处理成功。";
    } catch (e) {
        return "模拟处理完成。";
    }
}