import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Music, Heart, ListMusic, TrendingUp, Clock, Smile } from "lucide-react";

export default function Analytics() {
  const [stats, setStats] = useState({
    totalFavorites: 0,
    totalPlaylists: 0,
    totalSongsInPlaylists: 0,
    topEmotion: "",
    topArtist: "",
    recentActivity: [] as any[],
    emotionBreakdown: {} as Record<string, number>,
    artistBreakdown: {} as Record<string, number>,
    averageSongsPerPlaylist: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateStats();

    const handleUpdate = () => calculateStats();
    window.addEventListener("favoritesUpdated", handleUpdate);
    window.addEventListener("playlistsUpdated", handleUpdate);

    return () => {
      window.removeEventListener("favoritesUpdated", handleUpdate);
      window.removeEventListener("playlistsUpdated", handleUpdate);
    };
  }, []);

  // Fetch metadata from Spotify using web scraping
  const fetchSpotifyMetadata = async (url: string): Promise<{ artist: string; title: string }> => {
    try {
      // Try oEmbed first
      const response = await fetch(
        `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}&format=json`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log("Spotify oEmbed data:", data);
        
        // oEmbed returns author_name for artist
        if (data.author_name) {
          return {
            artist: data.author_name,
            title: data.title || "Unknown"
          };
        }
      }
    } catch (error) {
      console.error("Error fetching from Spotify oEmbed:", error);
    }

    // Fallback: extract from URL or return Unknown
    return { artist: "Unknown", title: "Unknown" };
  };

  const calculateStats = async () => {
    try {
      setLoading(true);

      // Get favorites
      const favs = localStorage.getItem("favourites");
      const favorites = favs ? JSON.parse(favs) : [];

      // Get playlists
      const lists = localStorage.getItem("playlists");
      const playlists = lists ? JSON.parse(lists) : [];

      // Collect all songs (favorites + playlist songs)
      const allSongs = [...favorites];
      playlists.forEach((playlist: any) => {
        allSongs.push(...playlist.songs);
      });

      console.log("Total songs to analyze:", allSongs.length);

      // Filter only Spotify links and fetch metadata
      const spotifySongs = allSongs.filter(song => 
        song.link && song.link.includes("open.spotify.com/track/")
      );

      console.log("Spotify songs found:", spotifySongs.length);

      // Fetch metadata for Spotify songs
      const songsWithMetadata = await Promise.all(
        spotifySongs.map(async (song) => {
          const metadata = await fetchSpotifyMetadata(song.link);
          return { ...song, artist: metadata.artist, title: metadata.title };
        })
      );

      console.log("Songs with metadata:", songsWithMetadata);

      // For non-Spotify songs, keep original data
      const nonSpotifySongs = allSongs.filter(song => 
        !song.link || !song.link.includes("open.spotify.com/track/")
      );

      const allProcessedSongs = [...songsWithMetadata, ...nonSpotifySongs];

      // Calculate emotion breakdown
      const emotionCount: Record<string, number> = {};
      allProcessedSongs.forEach((song) => {
        const emotion = song.emotion || "Unknown";
        emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
      });

      // Calculate artist breakdown with real artists
      const artistCount: Record<string, number> = {};
      allProcessedSongs.forEach((song) => {
        const artist = song.artist && song.artist !== "Unknown" ? song.artist : null;
        if (artist) {
          artistCount[artist] = (artistCount[artist] || 0) + 1;
        }
      });

      console.log("Artist breakdown:", artistCount);

      // Find top emotion
      const topEmotion = Object.keys(emotionCount).length > 0
        ? Object.entries(emotionCount).sort((a, b) => b[1] - a[1])[0][0]
        : "None";

      // Find top artist
      const topArtist = Object.keys(artistCount).length > 0
        ? Object.entries(artistCount).sort((a, b) => b[1] - a[1])[0][0]
        : "None";

      // Calculate total songs in playlists
      const totalSongsInPlaylists = playlists.reduce(
        (sum: number, p: any) => sum + p.songs.length,
        0
      );

      // Calculate average songs per playlist
      const averageSongsPerPlaylist =
        playlists.length > 0 ? (totalSongsInPlaylists / playlists.length).toFixed(1) : 0;

      // Recent activity (last 10 items)
      const recentActivity = [
        ...favorites.map((f: any) => ({
          type: "favorite",
          song: f.title,
          artist: f.artist,
          date: f.addedAt,
        })),
        ...playlists.map((p: any) => ({
          type: "playlist",
          name: p.name,
          date: p.createdAt,
        })),
      ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);

      setStats({
        totalFavorites: favorites.length,
        totalPlaylists: playlists.length,
        totalSongsInPlaylists,
        topEmotion,
        topArtist,
        recentActivity,
        emotionBreakdown: emotionCount,
        artistBreakdown: artistCount,
        averageSongsPerPlaylist: Number(averageSongsPerPlaylist),
      });
    } catch (error) {
      console.error("Error calculating stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojiMap: Record<string, string> = {
      Happy: "😊",
      Sad: "😢",
      Energetic: "⚡",
      Calm: "😌",
      Romantic: "💕",
      Angry: "😠",
      Nostalgic: "🌅",
      Relaxed: "🧘",
    };
    return emojiMap[emotion] || "🎵";
  };

  const getTopEmotions = () => {
    return Object.entries(stats.emotionBreakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const getTopArtists = () => {
    return Object.entries(stats.artistBreakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">📊 Your Music Analytics</h2>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Music className="w-12 h-12 animate-pulse mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Analyzing your music taste...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">📊 Your Music Analytics</h2>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold">{stats.totalFavorites}</p>
              <p className="text-xs text-muted-foreground">Favorites</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <ListMusic className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{stats.totalPlaylists}</p>
              <p className="text-xs text-muted-foreground">Playlists</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <Music className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{stats.totalSongsInPlaylists}</p>
              <p className="text-xs text-muted-foreground">Songs in Playlists</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{stats.averageSongsPerPlaylist}</p>
              <p className="text-xs text-muted-foreground">Avg Songs/Playlist</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Smile className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Top Emotion</h3>
          </div>
          {stats.topEmotion !== "None" ? (
            <>
              <div className="text-3xl mb-2">
                {getEmotionEmoji(stats.topEmotion)} {stats.topEmotion}
              </div>
              <p className="text-sm text-muted-foreground">
                You vibe with {stats.topEmotion.toLowerCase()} music the most!
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Add some favorites to see your top emotion!</p>
          )}
        </Card>

        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Music className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Top Artist</h3>
          </div>
          {stats.topArtist !== "None" ? (
            <>
              <div className="text-xl mb-2 font-semibold">{stats.topArtist}</div>
              <p className="text-sm text-muted-foreground">
                Your most saved artist across all songs
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Add some favorites to see your top artist!</p>
          )}
        </Card>
      </div>

      {/* Emotion Breakdown */}
      <Card variant="glass" className="p-5 mb-8">
        <h3 className="font-semibold mb-4">🎭 Emotion Distribution</h3>
        {getTopEmotions().length > 0 ? (
          <div className="space-y-3">
            {getTopEmotions().map(([emotion, count]) => (
              <div key={emotion}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">
                    {getEmotionEmoji(emotion)} {emotion}
                  </span>
                  <span className="text-sm font-semibold">{count} songs</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${(count / Object.values(stats.emotionBreakdown).reduce((a, b) => a + b, 0)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No emotion data yet. Start adding favorites!</p>
        )}
      </Card>

      {/* Top Artists */}
      <Card variant="glass" className="p-5 mb-8">
        <h3 className="font-semibold mb-4">🎤 Top Artists</h3>
        {getTopArtists().length > 0 ? (
          <div className="space-y-3">
            {getTopArtists().map(([artist, count], index) => (
              <div key={artist} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{artist}</p>
                  <p className="text-xs text-muted-foreground">{count} song{count !== 1 ? 's' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No artist data yet. Add favorites with Spotify links!</p>
        )}
      </Card>

      {/* Recent Activity */}
      <Card variant="glass" className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Recent Activity</h3>
        </div>
        {stats.recentActivity.length > 0 ? (
          <div className="space-y-2">
            {stats.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
              >
                <div className="flex items-center gap-3">
                  {activity.type === "favorite" ? (
                    <Heart className="w-4 h-4 text-red-500" />
                  ) : (
                    <ListMusic className="w-4 h-4 text-blue-500" />
                  )}
                  <div>
                    {activity.type === "favorite" ? (
                      <>
                        <p className="text-sm font-medium">{activity.song}</p>
                        <p className="text-xs text-muted-foreground">{activity.artist}</p>
                      </>
                    ) : (
                      <p className="text-sm font-medium">Created "{activity.name}"</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No recent activity. Start exploring music!</p>
        )}
      </Card>
    </div>
  );
}