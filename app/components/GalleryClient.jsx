"use client";

import { useEffect, useMemo, useState, useCallback } from "react";

const FAVORITES_KEY = "artwork-favorites";

function getUniqueArtists(artworks) {
  const set = new Set(artworks.map((artwork) => artwork.artist));
  return ["すべて", ...Array.from(set)];
}

export default function GalleryClient({ artworks }) {
  const [query, setQuery] = useState("");
  const [activeArtist, setActiveArtist] = useState("すべて");
  const [favorites, setFavorites] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showUI, setShowUI] = useState(true);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(FAVORITES_KEY) : null;
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }, [favorites]);

  const artists = useMemo(() => getUniqueArtists(artworks), [artworks]);

  const filtered = useMemo(() => {
    const lowered = query.toLowerCase();
    return artworks.filter((artwork) => {
      const matchesArtist = activeArtist === "すべて" || artwork.artist === activeArtist;
      const text = `${artwork.title} ${artwork.artist} ${artwork.tags.join(" ")}`.toLowerCase();
      const matchesQuery = text.includes(lowered);
      return matchesArtist && matchesQuery;
    });
  }, [artworks, query, activeArtist]);

  const activeArtwork = activeIndex !== null ? filtered[activeIndex] : null;

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]));
  };

  const openViewer = (index) => {
    setActiveIndex(index);
    setShowUI(true);
  };

  const closeViewer = () => {
    setActiveIndex(null);
  };

  const goNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % filtered.length;
    });
  }, [filtered.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + filtered.length) % filtered.length;
    });
  }, [filtered.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKey = (event) => {
      if (event.key === "Escape") {
        closeViewer();
      }
      if (event.key === "ArrowRight") {
        goNext();
      }
      if (event.key === "ArrowLeft") {
        goPrev();
      }
      if (event.key === " ") {
        event.preventDefault();
        setShowUI((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, goNext, goPrev]);

  const handleTouch = () => {
    let startX = 0;
    let endX = 0;

    const onStart = (event) => {
      startX = event.touches[0].clientX;
    };

    const onMove = (event) => {
      endX = event.touches[0].clientX;
    };

    const onEnd = () => {
      const delta = startX - endX;
      if (Math.abs(delta) > 40) {
        if (delta > 0) {
          goNext();
        } else {
          goPrev();
        }
      }
    };

    return { onStart, onMove, onEnd };
  };

  const { onStart, onMove, onEnd } = handleTouch();

  return (
    <main>
      <section className="header">
        <h1>美術作品コレクション</h1>
        <p>余白を楽しみながら、お気に入りの作品を静かに鑑賞するためのギャラリー。</p>
      </section>

      <section className="controls">
        <input
          className="search-input"
          placeholder="タイトル、作家、タグで検索"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="chips">
          {artists.map((artist) => (
            <button
              key={artist}
              className={`chip ${activeArtist === artist ? "active" : ""}`}
              onClick={() => setActiveArtist(artist)}
            >
              {artist}
            </button>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="empty-state">条件に一致する作品がありません。</div>
      ) : (
        <section className="masonry">
          {filtered.map((artwork, index) => (
            <article key={artwork.id} className="card" onClick={() => openViewer(index)}>
              <img src={artwork.image} alt={artwork.title} loading="lazy" />
              <div className="card-body">
                <div className="card-title">{artwork.title}</div>
                <div className="card-meta">{artwork.artist}</div>
                <div className="card-meta">{artwork.year}</div>
                <button
                  type="button"
                  className={`favorite ${favorites.includes(artwork.id) ? "active" : ""}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleFavorite(artwork.id);
                  }}
                  aria-label="お気に入り"
                >
                  {favorites.includes(artwork.id) ? "♥" : "♡"}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {activeArtwork && (
        <div className="modal-backdrop" onClick={closeViewer}>
          <div
            className="viewer"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={onStart}
            onTouchMove={onMove}
            onTouchEnd={onEnd}
          >
            <img src={activeArtwork.image} alt={activeArtwork.title} />
            <div className={`viewer-ui ${showUI ? "visible" : "hidden"}`}>
              <div className="viewer-info">
                <div>{activeArtwork.artist}</div>
                <div>{activeArtwork.title}</div>
                <div>{activeArtwork.year}</div>
              </div>
              <div className="viewer-controls">
                <button className="viewer-button" type="button" onClick={goPrev}>
                  ←
                </button>
                <button className="viewer-button" type="button" onClick={goNext}>
                  →
                </button>
              </div>
            </div>
            <div className="viewer-index">
              {activeIndex + 1} / {filtered.length}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
