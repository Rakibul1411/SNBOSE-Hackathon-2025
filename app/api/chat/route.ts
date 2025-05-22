import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Define fallback model list
const models = [
  "gemini-2.0-flash",
  "gemini-2.5-flash-preview-04-17",
];

// Helper function to structure response for better readability
function structureResponse(text: string) {
  // First pass - normalize key facts formatting
  let structured = text.replace(/\*\*Key Facts:\*\*/g, '**Key Facts:**');
  
  // Format location, capital, government, etc. sections consistently
  structured = structured.replace(/\*\*([^:*]+):\*\*/g, '**$1:**');
  
  // Add clear section breaks before numbered sections
  structured = structured.replace(/(\d+)\.\s+\*\*([^:*]+):\*\*/g, '\n\n$1. **$2:**');
  
  // Add proper spacing between sections
  structured = structured.replace(/\.\s+\*\*([^:*]+):\*\*/g, '.\n\n**$1:**');
  
  // Ensure proper paragraph breaks
  structured = structured.replace(/\.\s+([A-Z])/g, '.\n\n$1');
  
  return structured;
}

export async function POST(req: Request) {
  try {
    const { message, imageUrl } = await req.json();
    
    let prompt = message;
    let parts = [];
    
    // If image is provided, prepare for multimodal input
    if (imageUrl) {
      parts = [
        { text: "Please analyze this image and provide detailed information: " + message },
        { inlineData: { mimeType: "image/jpeg", data: imageUrl.split(',')[1] } }
      ];
    } else {
      parts = [{ text: "Please provide a well-structured, clear response to: " + message }];
    }

    for (const modelName of models) {
      try {
        console.log(`Trying Gemini model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = imageUrl 
          ? await model.generateContent({ contents: [{ parts }] })
          : await model.generateContent(prompt);
        
        const response = await result.response;
        let text = response.text();
        
        // Apply formatting for better readability
        text = structureResponse(text);

        return NextResponse.json({ 
          reply: text, 
          model: modelName 
        });
      } catch (error) {
        console.warn(`Model ${modelName} failed:`, error);
        // Try next model
      }
    }

    // All models failed
    return NextResponse.json(
      { error: 'All Gemini models failed to generate a response' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 