import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('Received request to generate image');
    const { prompt } = await request.json();
    console.log('Image prompt:', prompt);
    
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.error('API key is not configured');
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      );
    }
    
    console.log('Initializing Gemini API...');
    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp-image-generation'
    });
    
    console.log('Generating content...');
    // Generate content with image generation enabled
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['Text', 'Image']
      }
    });
    
    const response = result.response;
    console.log('Received result from Gemini');
    
    // Process the response
    let imageUrl = null;
    let text = '';
    
    if (response.candidates && 
        response.candidates[0] && 
        response.candidates[0].content && 
        response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          text = part.text;
          console.log('Generated text:', text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          imageUrl = `data:${part.inlineData.mimeType};base64,${imageData}`;
          console.log('Generated image data');
        }
      }
    } else {
      console.error('Unexpected response structure:', JSON.stringify(response));
    }
    
    // If no image was generated, use a placeholder
    if (!imageUrl) {
      imageUrl = `/api/placeholder/800/600?text=${encodeURIComponent(text.substring(0, 50) || prompt)}`;
      console.log('Using placeholder image');
    }
    
    return NextResponse.json({
      text,
      imageUrl
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}