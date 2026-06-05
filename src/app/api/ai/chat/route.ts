import { NextRequest, NextResponse } from 'next/server';
import { getWorkspace } from '@/lib/firebase/firestore';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(req: NextRequest) {
  try {
    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Groq API key is not configured' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages, workspaceId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Fetch workspace data for vertical context
    let verticalContext = 'general business';
    if (workspaceId) {
      try {
        const workspace = await getWorkspace(workspaceId);
        if (workspace?.businessType) {
          verticalContext = workspace.businessType;
        }
      } catch (e) {
        console.warn('Could not fetch workspace for AI context:', e);
      }
    }

    const systemPrompt = `You are the QRAZY AI Assistant, an expert in Augmented Reality commerce and spatial marketing. You are helping a business owner who operates in the "${verticalContext}" industry.

Your expertise includes:
- AR commerce best practices for the ${verticalContext} vertical
- QR code marketing strategies
- 3D model optimization tips
- Customer engagement techniques
- Product presentation in AR
- Analytics interpretation
- Business growth strategies specific to ${verticalContext}

Guidelines:
- Be concise, friendly, and actionable
- Give specific advice tailored to the ${verticalContext} industry
- Use bullet points for lists
- Suggest practical AR use cases for their business type
- If asked about technical implementation, explain simply
- Always encourage the use of AR to enhance customer experience

Remember: You represent QRAZY, the AI-powered AR commerce platform that helps businesses create AR experiences from simple product images.`;

    // Call Groq API
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || 'I apologize, I could not generate a response.';

    return NextResponse.json({ message: aiMessage });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}