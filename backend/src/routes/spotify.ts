/*creating an Express API route that frontend can call to get a Spotify track ID by providing a track name and artist*/
import express from "express";
import { getSpotifyToken } from "../spotifyToken";
import { searchSpotifyTrack } from "../spotifySearch";

const router = express.Router();

router.get("/track-id", async (req, res) => {
  const { track, artist } = req.query;

  if (!track || !artist) {
    return res.status(400).json({ error: "Missing track or artist" });
  }

  try {
    const token = await getSpotifyToken();
    const trackId = await searchSpotifyTrack(
      track as string,
      artist as string,
      token
    );

    res.json({ trackId });
  } catch (err) {
    res.status(500).json({ error: "Spotify search failed" });
  }
});

export default router;
