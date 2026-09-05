import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Music, Trash2 } from "lucide-react";
import SongCard from "@/components/SongCard";
import Footer from  "@/components/Footer";
export default function Playlists() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null);

  const loadPlaylists = () => {
    try {
      const lists = localStorage.getItem("playlists");
      setPlaylists(lists ? JSON.parse(lists) : []);
    } catch {
      setPlaylists([]);
    }
  };

  const deletePlaylist = (playlistId: string) => {
    if (!confirm("Delete this playlist?")) return;
    const updated = playlists.filter(p => p.id !== playlistId);
    localStorage.setItem("playlists", JSON.stringify(updated));
    setPlaylists(updated);
    if (selectedPlaylist?.id === playlistId) setSelectedPlaylist(null);
  };

  const removeSongFromPlaylist = (playlistId: string, songLink: string) => {
    const lists = [...playlists];
    const playlist = lists.find(p => p.id === playlistId);
    if (!playlist) return;

    playlist.songs = playlist.songs.filter((s: any) => s.link !== songLink);
    localStorage.setItem("playlists", JSON.stringify(lists));
    setPlaylists(lists);
    setSelectedPlaylist({ ...playlist });
  };

  useEffect(() => {
    loadPlaylists();
    const handleUpdate = () => loadPlaylists();
    window.addEventListener("playlistsUpdated", handleUpdate);
    return () => window.removeEventListener("playlistsUpdated", handleUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-black/90">
      <div className="max-w-6xl mx-auto px-6 py-14">
        {!selectedPlaylist ? (
          <>
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Your Playlists
            </h2>

            {playlists.length === 0 ? (
              <div className="glass p-10 rounded-2xl text-center text-muted-foreground">
                No playlists yet  
                <p className="mt-2 text-sm">
                  Add songs using the + icon to create one
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {playlists.map(playlist => (
                  <Card
                    key={playlist.id}
                    variant="glass"
                    className="p-5 cursor-pointer hover:scale-105 hover:shadow-[0_0_40px_rgba(0,255,255,0.15)] transition-all relative"
                    onClick={() => setSelectedPlaylist(playlist)}
                  >
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        deletePlaylist(playlist.id);
                      }}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-3 mb-3">
                      <Music className="w-9 h-9 text-cyan-400" />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {playlist.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {playlist.songs.length} song
                          {playlist.songs.length !== 1 && "s"}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Created {new Date(playlist.createdAt).toLocaleDateString()}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => setSelectedPlaylist(null)}
              className="mb-6 text-cyan-400 hover:underline"
            >
              ← Back to playlists
            </button>

            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {selectedPlaylist.name}
            </h2>

            {selectedPlaylist.songs.length === 0 ? (
              <p className="text-muted-foreground">
                No songs in this playlist yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedPlaylist.songs.map((song: any, i: number) => (
                  <div key={song.link} className="relative">
                    <SongCard
                      title={song.title}
                      artist={song.artist}
                      emotion={song.emotion}
                      link={song.link}
                      delay={i * 0.05}
                    />
                    <button
                      onClick={() =>
                        removeSongFromPlaylist(selectedPlaylist.id, song.link)
                      }
                      className="absolute top-2 left-2 bg-black/80 rounded-full p-1.5 text-red-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
