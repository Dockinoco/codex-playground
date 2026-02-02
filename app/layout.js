import "./globals.css";
import SpotifyPlayer from "./components/SpotifyPlayer";
import site from "../data/site.json";

export const metadata = {
  title: "Artworks Gallery",
  description: "Browse and enjoy a curated art collection."
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        {children}
        <SpotifyPlayer embedUrl={site.spotifyEmbedUrl} />
      </body>
    </html>
  );
}
