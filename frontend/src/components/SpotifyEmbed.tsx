import { useEffect, useRef } from "react";

interface Props {
  spotifyId: string;
  isActive?: boolean;
  onPlay?: () => void;
}

const SPOTIFY_ORIGIN = "https://open.spotify.com";

export default function SpotifyEmbed({
  spotifyId,
  isActive = false,
  onPlay,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (isActive) {
      iframeRef.current?.contentWindow?.postMessage(
        { method: "play" },
        SPOTIFY_ORIGIN
      );
      onPlay?.();
    }
  }, [isActive, onPlay]);

  return (
    <div style={{ width: "100%", height: "100px" }}>
      <iframe
        ref={iframeRef}
        src={`https://open.spotify.com/embed/track/${spotifyId}`}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
