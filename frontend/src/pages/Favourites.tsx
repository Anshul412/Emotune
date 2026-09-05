import { useEffect, useState } from "react";
import SongCard from "@/components/SongCard";
import Footer from "@/components/Footer";

export default function Favourites() {
  const [songs, setSongs] = useState<any[]>([]);

  const loadFavorites = () => {
    try {
      const favs = localStorage.getItem("favourites");
      const parsed = favs ? JSON.parse(favs) : [];
      setSongs(parsed);
    } catch {
      setSongs([]);
    }
  };

  useEffect(() => {
    loadFavorites();
    const handleUpdate = () => loadFavorites();
    window.addEventListener("favoritesUpdated", handleUpdate);
    return () => window.removeEventListener("favoritesUpdated", handleUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-black/90">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Your Favourites
        </h1>

        {songs.length === 0 ? (
          <div className="glass p-10 rounded-2xl text-center text-muted-foreground">
            No favourites yet  
            <p className="mt-2 text-sm">
              Tap the heart icon on any song to save it here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {songs.map((song, i) => (
              <SongCard
                key={song.link}
                title={song.title}
                artist={song.artist}
                emotion={song.emotion}
                link={song.link}
                delay={i * 0.05}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
