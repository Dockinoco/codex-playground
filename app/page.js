import artworks from "../data/artworks.json";
import GalleryClient from "./components/GalleryClient";

export default function Page() {
  return <GalleryClient artworks={artworks} />;
}
