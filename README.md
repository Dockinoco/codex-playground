# 美術作品コレクション閲覧サイト

余白を贅沢に使い、作品を見やすく配置したMasonry（CSS columns）レイアウトのギャラリーです。検索・作家フィルタ・お気に入り・フルスクリーンViewer・音楽プレイヤーを備えています。

## ディレクトリ構成

```
app/
  components/
    GalleryClient.jsx
    SpotifyPlayer.jsx
  globals.css
  layout.js
  page.js
data/
  artworks.json
  site.json
public/
  artworks/
    *.svg
```

## 起動手順

```bash
npm install
npm run dev
```

`http://localhost:3000` を開くとギャラリーが表示されます。

## 作品追加手順

1. 作品画像を `public/artworks/` に追加
2. `data/artworks.json` に作品情報を追記

```json
{
  "id": "unique-id",
  "title": "作品タイトル",
  "artist": "作家名",
  "year": "制作年",
  "image": "/artworks/your-image.jpg",
  "tags": ["tag1", "tag2"]
}
```

## 音楽URLの差し替え手順

`data/site.json` の `spotifyEmbedUrl` にSpotifyの埋め込みURLを貼り付けてください。

```json
{
  "spotifyEmbedUrl": "https://open.spotify.com/embed/playlist/..."
}
```

## 画像の取り扱いについて

- 画像は許諾済み・自前制作のもののみを推奨します。
- 外部参照リンクで運用する場合も、著作権・利用規約に十分配慮してください。
- 公開前に権利者の許諾範囲を必ず確認してください。
