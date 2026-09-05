import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Heart, Plus, Play } from "lucide-react";
import { useEffect, useState } from "react";

type SongCardProps = {
  title: string;
  artist: string;
  emotion: string;
  delay?: number;
  link: string;
};

const SongCard = ({
  title,
  artist,
  emotion,
  delay = 0,
  link,
}: SongCardProps) => {
  const [isFav, setIsFav] = useState(false);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);

  // -----------------------------
  // FAVORITES
  // -----------------------------

  const getFavorites = () => {
    try {
      return JSON.parse(
        localStorage.getItem("favourites") || "[]"
      );
    } catch {
      return [];
    }
  };

  const saveFavorites = (favorites: any[]) => {
    localStorage.setItem(
      "favourites",
      JSON.stringify(favorites)
    );
  };

  // -----------------------------
  // PLAYLISTS
  // -----------------------------

  const getPlaylists = () => {
    try {
      return JSON.parse(
        localStorage.getItem("playlists") || "[]"
      );
    } catch {
      return [];
    }
  };

  const savePlaylists = (lists: any[]) => {
    localStorage.setItem(
      "playlists",
      JSON.stringify(lists)
    );

    window.dispatchEvent(
      new Event("playlistsUpdated")
    );
  };

  // -----------------------------
  // CHECK FAVORITE
  // -----------------------------

  useEffect(() => {
    const favorites = getFavorites();

    setIsFav(
      favorites.some(
        (f: any) => f.link === link
      )
    );
  }, [link]);

  // -----------------------------
  // LOAD PLAYLISTS
  // -----------------------------

  useEffect(() => {
    if (showPlaylistMenu) {
      setPlaylists(getPlaylists());
    }
  }, [showPlaylistMenu]);

  // -----------------------------
  // TOGGLE FAVORITE
  // -----------------------------

  const toggleFavourite = () => {
    const favorites = getFavorites();

    if (isFav) {
      const updatedFavorites = favorites.filter(
        (f: any) => f.link !== link
      );

      saveFavorites(updatedFavorites);
      setIsFav(false);
    } else {
      favorites.push({
        title,
        artist,
        emotion,
        link,
        addedAt: new Date().toISOString(),
      });

      saveFavorites(favorites);
      setIsFav(true);
    }

    window.dispatchEvent(
      new Event("favoritesUpdated")
    );
  };

  // -----------------------------
  // ADD TO PLAYLIST
  // -----------------------------

  const addToPlaylist = (playlistId: string) => {
    const lists = getPlaylists();

    const playlist = lists.find(
      (p: any) => p.id === playlistId
    );

    if (!playlist) return;

    if (
      playlist.songs.some(
        (s: any) => s.link === link
      )
    ) {
      alert("Already in playlist");
      return;
    }

    playlist.songs.push({
      title,
      artist,
      emotion,
      link,
      addedAt: new Date().toISOString(),
    });

    savePlaylists(lists);

    setShowPlaylistMenu(false);
  };

  // -----------------------------
  // CREATE NEW PLAYLIST
  // -----------------------------

  const createNewPlaylist = () => {
    if (!newPlaylistName.trim()) {
      alert("Enter playlist name");
      return;
    }

    const lists = getPlaylists();

    const newPlaylist = {
      id: Date.now().toString(),
      name: newPlaylistName.trim(),
      createdAt: new Date().toISOString(),

      songs: [
        {
          title,
          artist,
          emotion,
          link,
          addedAt: new Date().toISOString(),
        },
      ],
    };

    lists.push(newPlaylist);

    savePlaylists(lists);

    setShowPlaylistMenu(false);
    setShowNewPlaylistInput(false);
    setNewPlaylistName("");
  };

  // -----------------------------
  // PLAY SONG
  // -----------------------------

  const handlePlay = () => {
    if (!link) {
      alert("Song link is not available");
      return;
    }

    window.open(
      link,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={{
        opacity: 1,
        y: -10,
      }}
      transition={{
        delay,
      }}
      className="relative"
    >
      <Card
        variant="glass"
        className="p-3 w-100 h-40 relative"
      >

        {/* FAVORITE BUTTON */}

        <button
          onClick={toggleFavourite}
          className="absolute top-3 right-10 z-10"
        >
          <Heart
            className={`w-5 h-5 transition-all duration-200 ${
              isFav
                ? "fill-red-500 text-red-500"
                : "text-white/70 hover:text-white hover:scale-110"
            }`}
          />
        </button>

        {/* PLAYLIST BUTTON */}

        <button
          onClick={() =>
            setShowPlaylistMenu(
              !showPlaylistMenu
            )
          }
          className="absolute top-3 right-3 z-10"
        >
          <Plus className="w-5 h-5 text-white/70 hover:text-white hover:scale-110 transition-all duration-200" />
        </button>

        {/* SONG TITLE */}

        <h4 className="font-semibold text-sm truncate pr-16">
          {title}
        </h4>

        {/* ARTIST */}

        <p className="text-xs text-muted-foreground truncate">
          {artist}
        </p>

        {/* PLAY BUTTON */}

        <div className="mt-4">

          <button
            onClick={handlePlay}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            <Play className="w-4 h-4 fill-current" />

            Play Song
          </button>

          <p className="text-[10px] text-muted-foreground mt-2">
            Open song on Last.fm
          </p>

        </div>

      </Card>

      {/* PLAYLIST MENU */}

      {showPlaylistMenu && (
        <div className="absolute top-12 right-0 z-50 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg p-3 min-w-[200px] shadow-xl">

          <h5 className="text-sm font-semibold mb-2">
            Add to Playlist
          </h5>

          {/* EXISTING PLAYLISTS */}

          {playlists.length > 0 && (
            <div className="mb-2 max-h-[150px] overflow-y-auto">

              {playlists.map(
                (playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() =>
                      addToPlaylist(
                        playlist.id
                      )
                    }
                    className="w-full text-left px-2 py-1.5 text-sm hover:bg-white/10 rounded transition"
                  >
                    {playlist.name} (
                    {playlist.songs.length}
                    )
                  </button>
                )
              )}

            </div>
          )}

          {/* CREATE PLAYLIST */}

          {!showNewPlaylistInput ? (

            <button
              onClick={() =>
                setShowNewPlaylistInput(true)
              }
              className="w-full text-left px-2 py-1.5 text-sm text-primary hover:bg-white/10 rounded transition"
            >
              + Create New Playlist
            </button>

          ) : (

            <div className="space-y-2">

              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) =>
                  setNewPlaylistName(
                    e.target.value
                  )
                }
                placeholder="Playlist name..."
                className="w-full px-2 py-1 text-sm bg-white/10 border border-white/20 rounded"
                autoFocus
                onKeyDown={(e) => {

                  if (e.key === "Enter") {
                    createNewPlaylist();
                  }

                  if (e.key === "Escape") {
                    setShowNewPlaylistInput(
                      false
                    );
                  }

                }}
              />

              <div className="flex gap-2">

                <button
                  onClick={createNewPlaylist}
                  className="flex-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:opacity-90"
                >
                  Create
                </button>

                <button
                  onClick={() => {
                    setShowNewPlaylistInput(
                      false
                    );
                    setNewPlaylistName("");
                  }}
                  className="flex-1 px-2 py-1 text-xs bg-white/10 rounded hover:bg-white/20"
                >
                  Cancel
                </button>

              </div>

            </div>

          )}

          {/* CLOSE */}

          <button
            onClick={() =>
              setShowPlaylistMenu(false)
            }
            className="w-full mt-2 px-2 py-1 text-xs text-muted-foreground hover:text-white"
          >
            Close
          </button>

        </div>
      )}

    </motion.div>
  );
};

export default SongCard;