import requests
import base64
import time
from app.core.config import (
    LASTFM_API_KEY,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
)
#Emotion-genre mapping
MOOD_MAP = {
    "happy": ["happy", "dance", "pop"],
    "sad": ["sad", "acoustic", "melancholic"],
    "angry": ["rock", "metal"],
    "neutral": ["chill", "ambient"],
    "fear": ["calm", "soothing"],
    "surprise": ["upbeat", "indie"],
    "disgust": ["dark", "industrial"],
}

#Spotify token

_SPOTIFY_TOKEN = None
_SPOTIFY_EXPIRY = 0


def get_spotify_token():
    global _SPOTIFY_TOKEN, _SPOTIFY_EXPIRY

    if _SPOTIFY_TOKEN and time.time() < _SPOTIFY_EXPIRY:
        return _SPOTIFY_TOKEN

    auth = base64.b64encode(
        f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}".encode()
    ).decode()

    r = requests.post(
        "https://accounts.spotify.com/api/token",
        headers={
            "Authorization": f"Basic {auth}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data={"grant_type": "client_credentials"},
    )

    data = r.json()
    _SPOTIFY_TOKEN = data["access_token"]
    _SPOTIFY_EXPIRY = time.time() + data["expires_in"]

    return _SPOTIFY_TOKEN


def search_spotify(track_name, artist_name):
    try:
        token = get_spotify_token()
        q = f"track:{track_name} artist:{artist_name}"

        r = requests.get(
            "https://api.spotify.com/v1/search",
            headers={"Authorization": f"Bearer {token}"},
            params={"q": q, "type": "track", "limit": 1},
        )

        items = r.json().get("tracks", {}).get("items", [])
        if items:
            return items[0]["external_urls"]["spotify"]
    except Exception as e:
        print("Spotify search error:", e)

    return None



def get_music(emotion):
    songs = []
    seen = set()

    for tag in MOOD_MAP.get(emotion, []):
        r = requests.get(
            "http://ws.audioscrobbler.com/2.0/",
            params={
                "method": "tag.gettoptracks",
                "tag": tag,
                "api_key": LASTFM_API_KEY,
                "format": "json",
                "limit": 3,
            },
        )

        if r.status_code != 200:
            continue

        for track in r.json()["tracks"]["track"]:
            name = track["name"]
            artist = track["artist"]["name"]

            key = f"{name}-{artist}"
            if key in seen:
                continue
            seen.add(key)

            spotify_url = search_spotify(name, artist)

            songs.append(
                {
                    "name": name,
                    "artist": artist,
                    "spotifyUrl": spotify_url,
                }
            )

    return songs
