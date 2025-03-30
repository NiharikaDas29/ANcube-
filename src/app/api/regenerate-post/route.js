import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('Received request to regenerate post');
    const { prompt, hotelName, eventDetails, promptDetails } = await request.json();
    console.log('Request data:', { prompt, hotelName, eventDetails, promptDetails });
    
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Create a structured prompt for the post
    const systemPrompt = `Create 1 unique and engaging social media post for ${hotelName} about their event: ${eventDetails}.
    
Additional prompt details: ${promptDetails}

Guidelines:
- Post should be concise (max 280 characters)
- Include relevant hashtags
- Use appropriate emojis
- Make the post unique with a different angle/focus
- Format the response as a JSON array with a single string

Example output format:
["Exciting post text with #hashtags and emojis"]`;
    
    console.log('Generating content...');
    try {
      const result = await model.generateContent(systemPrompt);
      const response = result.response;
      const text = response.text();
      console.log('Received response from Gemini:', text);
      
      // Parse the response to get the post text
      let post;
      try {
        // Try to parse the direct JSON response
        post = JSON.parse(text);
        console.log('Successfully parsed JSON response');
      } catch (e) {
        console.error('Failed to parse direct JSON:', e);
        // If direct parsing fails, try to extract JSON from the text
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          try {
            post = JSON.parse(jsonMatch[0]);
            console.log('Successfully parsed extracted JSON');
          } catch (innerError) {
            console.error("Failed to parse extracted JSON:", innerError);
            post = [text.replace(/^"|"$/g, '')]; // Remove quotes if present
          }
        } else {
          post = [text];
        }
      }
      
      return NextResponse.json({ 
        candidates: [{
          content: {
            parts: [{ text: Array.isArray(post) ? post[0] : post }]
          }
        }]
      });
    } catch (genError) {
      console.error('Error during content generation:', genError);
      if (genError.message.includes('API key')) {
        return NextResponse.json(
          { error: "Invalid or expired API key" },
          { status: 401 }
        );
      }
      if (genError.message.includes('quota')) {
        return NextResponse.json(
          { error: "API quota exceeded" },
          { status: 429 }
        );
      }
      throw genError;
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to regenerate post" },
      { status: 500 }
    );
  }
}