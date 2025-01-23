import { getAccessToken } from './auth';

export async function callGeminiAPI(prompt: string) {
  const token = await getAccessToken();

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      prompt: {
        text: prompt,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API Error: ${response.statusText}`);
  }

  const data = await response.text();
  if (!data) {
    throw new Error('Empty response from Gemini API');
  }

  let parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch (error) {
    throw new Error('Error parsing JSON response from Gemini API');
  }

  if (parsedData.error) {
    throw new Error(`Gemini API Error: ${parsedData.error.message}`);
  }

  return parsedData;
}
