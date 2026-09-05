const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;

export const getRecommendedTrack = async (emotion: string) => {
  const res = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${emotion}&api_key=${API_KEY}&format=json&limit=1`
  );

  const data = await res.json();
  const track = data.tracks.track[0];

  return {
    artist: track.artist.name,
    title: track.name,
  };
};
