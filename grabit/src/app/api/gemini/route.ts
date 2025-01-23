import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const apiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAxGAeHZIXqLyYYKUfI48eSt8Q7RWPxlQI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      throw new Error(`Gemini API Error: ${errorData.error.message}`);
    }

    const data = await apiResponse.json();

    console.log('Gemini API Response:', data);


    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (responseText) {
      return NextResponse.json({ text: responseText });
    } else {
      throw new Error('No valid response from Gemini API');
    }

  } catch (error: any) {
    console.error('Error connecting to Gemini API:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
