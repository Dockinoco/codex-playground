import "./globals.css";

export const metadata = {
  title: "Artworks Gallery",
  description: "Immersive art collection gallery"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        {children}
        <div className="spotify">
          <iframe
            title="Spotify playlist"
            src="https://open.spotify.com/embed/playlist/0iJEh2BsvSw8V3lDTkiUK7"
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      </body>
    </html>
  );
}
