import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received prompt:', body.prompt);

    if (!body.prompt || typeof body.prompt !== 'string') {
      return NextResponse.json(
        { error: "Prompt harus berupa string" },
        { status: 400 }
      );
    }

    console.log('Calling Gemini API with URL:', process.env.GEMINI_API_URL);

    const geminiResponse = await fetch(`${process.env.GEMINI_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`, 
      },
      body: JSON.stringify({
        prompt: body.prompt || process.env.DEFAULT_PROMPT || "Berikan teks default untuk di-generate",
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error(`Gemini API Error: ${errorText}`);
      throw new Error(`Gemini API Error: ${geminiResponse.statusText}`);
    }

    const data = await geminiResponse.json();

    console.log('Received data from Gemini API:', data);

    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error("Error connecting to Gemini API:", error);

    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat menghubungi Gemini API" },
      { status: 500 }
    );
  }
}
