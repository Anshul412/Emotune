/*getting and caching a Spotify access token using Spotify’s Client Credentials OAuth flow*/
import fetch from "node-fetch";

let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function getSpotifyToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = (await res.json()) as {
  access_token: string;
  expires_in: number;
};

cachedToken = data.access_token;
tokenExpiry = Date.now() + data.expires_in * 1000;

  return cachedToken;
}
