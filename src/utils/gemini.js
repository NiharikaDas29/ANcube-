import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Get the text generation model (Gemini Pro)
export const getGeminiProModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-pro" });
};

// Get the multimodal model (Gemini Pro Vision) - for future image input
export const getGeminiVisionModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-pro-vision" });
};

// Text generation function
export async function generateTextContent(prompt) {
  try {
    const model = getGeminiProModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating text with Gemini:", error);
    throw error;
  }
}

// Function to generate image prompts (for use with image generation APIs)
export async function generateImagePrompt(textPrompt) {
  try {
    const model = getGeminiProModel();
    const prompt = `Create a detailed description for an image generation AI based on this context: ${textPrompt}. 
                   Focus on visual elements, style, lighting, mood, and composition.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating image prompt with Gemini:", error);
    throw error;
  }
}