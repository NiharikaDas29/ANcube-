import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('Received request to generate posts');
    const { hotelName, eventDetails, promptDetails, count = 4 } = await request.json();
    console.log('Request data:', { hotelName, eventDetails, promptDetails, count });
    
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
    const model = genAI.getGenerativeModel({  model: "gemini-2.0-flash" });
    
    // Create a prompt for Gemini
    const prompt = `Create ${count} unique and engaging social media posts for ${hotelName} about their event: ${eventDetails}.
    
Additional prompt details: ${promptDetails}

Guidelines:
- Each post should be concise (max 280 characters)
- Include relevant hashtags
- Use appropriate emojis
- Make each post unique with different angles/focus
- Format the response as a JSON array of strings, with each string being a complete post.

Example output format:
["Post 1 text with #hashtags and emojis", "Post 2 text with #hashtags and emojis", ...]`;
    
    console.log('Sending prompt to Gemini:', prompt);
    
    // Generate content
    console.log('Generating content...');
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      console.log('Received response from Gemini:', text);
      
      // Parse the JSON response
      let posts;
      try {
        // Try to parse the direct JSON response
        posts = JSON.parse(text);
        console.log('Successfully parsed JSON response');
      } catch (e) {
        console.error('Failed to parse direct JSON:', e);
        // If direct parsing fails, try to extract JSON from the text
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          try {
            posts = JSON.parse(jsonMatch[0]);
            console.log('Successfully parsed extracted JSON');
          } catch (innerError) {
            console.error("Failed to parse extracted JSON:", innerError);
            throw new Error("Failed to parse the AI response");
          }
        } else {
          console.log('Falling back to line-by-line parsing');
          // If we can't extract JSON, split by newlines and clean up
          posts = text.split('\n')
            .filter(line => line.trim() && !line.includes('```'))
            .map(line => line.replace(/^\d+\.\s*/, '').trim())
            .slice(0, count);
        }
      }
      
      console.log('Final posts array:', posts);
      
      // Ensure we have the requested number of posts
      while (posts.length < count) {
        posts.push(`Join us at ${hotelName} for our amazing ${eventDetails}! #ExcitingTimes #HotelEvent`);
      }
      
      // Trim to the requested count
      posts = posts.slice(0, count);
      
      return NextResponse.json({ posts });
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
      { error: error.message || "Failed to generate posts" },
      { status: 500 }
    );
  }
}