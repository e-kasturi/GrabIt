import { OAuth2Client } from 'google-auth-library';

const clientId = process.env.GOOGLE_CLIENT_ID!;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const redirectUri = 'http://localhost:3000/oauth2callback'; 

const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

export async function getAccessToken(): Promise<string> {
  const { token } = await oauth2Client.getAccessToken();
  if (!token) {
    throw new Error('Failed to obtain access token');
  }
  return token;
}
