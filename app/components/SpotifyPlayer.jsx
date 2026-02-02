"use client";

import { useState } from "react";

export default function SpotifyPlayer({ embedUrl }) {
  const [open, setOpen] = useState(false);

  if (!embedUrl) {
    return null;
  }

  return (
    <div className="player-shell">
      <button className="player-toggle" type="button" onClick={() => setOpen((prev) => !prev)}>
        {open ? "音楽を隠す" : "音楽を聴く"}
      </button>
      <iframe
        className={open ? "player-frame" : "hidden"}
        src={embedUrl}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify playlist"
      />
    </div>
  );
}
