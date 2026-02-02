"use client";

import { useEffect, useMemo, useState } from "react";
import artworks from "../data/artworks.json";

const FAVORITES_KEY = "artworks:favorites";

export default function GalleryPage() {
  const [query, setQuery] = useState("");
  const [artistFilter, setArtistFilter] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [viewerIndex, setViewerIndex] = useState(null);
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const artists = useMemo(() => {
    return ["all", ...new Set(artworks.map((item) => item.artist))];
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    return artworks.filter((item) => {
      const matchesQuery = [item.title, item.artist, item.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
      const matchesArtist = artistFilter === "all" || item.artist === artistFilter;
      return matchesQuery && matchesArtist;
    });
  }, [artistFilter, query]);

  const openViewer = (index) => {
    setViewerIndex(index);
  };

  const closeViewer = () => {
    setViewerIndex(null);
  };

  const goNext = () => {
    setViewerIndex((current) => (current + 1) % filtered.length);
  };

  const goPrev = () => {
    setViewerIndex((current) =>
      current === 0 ? filtered.length - 1 : current - 1
    );
  };

  useEffect(() => {
    if (viewerIndex === null) return;
    const handler = (event) => {
      if (event.key === "Escape") {
        closeViewer();
      }
      if (event.key === "ArrowRight") {
        goNext();
      }
      if (event.key === "ArrowLeft") {
        goPrev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [viewerIndex, filtered.length]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleTouchStart = (event) => {
    setTouchStart(event.touches[0].clientX);
  };

  const handleTouchEnd = (event) => {
    if (touchStart === null) return;
    const endX = event.changedTouches[0].clientX;
    const delta = endX - touchStart;
    if (Math.abs(delta) > 60) {
      if (delta < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
    setTouchStart(null);
  };

  const viewerArtwork = viewerIndex !== null ? filtered[viewerIndex] : null;

  return (
    <main>
      <header>
        <h1>Art Collection</h1>
        <p className="subtitle">
          静かな余白の中で、作品と向き合うためのコレクションビュー。
        </p>
        <div className="controls">
          <input
            type="search"
            placeholder="タイトル・作者・タグを検索"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            value={artistFilter}
            onChange={(event) => setArtistFilter(event.target.value)}
          >
            {artists.map((artist) => (
              <option key={artist} value={artist}>
                {artist === "all" ? "すべての作者" : artist}
              </option>
            ))}
          </select>
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="empty">該当する作品がありません。</div>
      ) : (
        <section className="masonry">
          {filtered.map((item, index) => (
            <article
              key={item.id}
              className="card"
              onClick={() => openViewer(index)}
            >
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="card-footer">
                <div>
                  <p className="card-title">{item.title}</p>
                  <p className="card-artist">{item.artist}</p>
                </div>
                <button
                  className={`favorite-btn ${
                    favorites.includes(item.id) ? "active" : ""
                  }`}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  aria-label="お気に入り"
                >
                  {favorites.includes(item.id) ? "♥" : "♡"}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {viewerArtwork && (
        <div
          className="viewer"
          role="dialog"
          aria-modal="true"
          onClick={closeViewer}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button className="viewer-close" onClick={closeViewer}>
            ×
          </button>
          <div
            className="viewer-content"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={viewerArtwork.image} alt={viewerArtwork.title} />
            <div>
              <strong>{viewerArtwork.title}</strong>
              <p>{viewerArtwork.artist}</p>
            </div>
            <div className="viewer-controls">
              <button onClick={goPrev}>← 前へ</button>
              <button onClick={goNext}>次へ →</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
