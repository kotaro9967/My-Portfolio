# Kotaro Ozawa Portfolio (Astro)

小澤虎汰朗のポートフォリオサイトです

## セットアップ

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ に静的書き出し
npm run preview  # ビルド結果の確認
```

Node.js 18.20.8 以上（20 以上推奨）が必要です。

## ページ構成

| URL | 中身 |
| --- | --- |
| `/` | トップ（Hero / Profile / Skills / Works / News / Contact） |
| `/about` | プロフィールとスキルの詳細 |
| `/works` | 実績一覧 |
| `/works/{slug}` | 実績の詳細（Markdown から自動生成） |
| `/news` | お知らせ一覧 |
| `/news/{slug}` | お知らせの詳細（Markdown から自動生成） |
| `/404` | 404ページ |

`sitemap-index.xml` はビルド時に自動生成されます。

## ディレクトリ構成

```
├── astro.config.mjs
├── public/
│   ├── assets/              … 画像・アイコン（webp + png）
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── content.config.ts    … works / news のスキーマ定義
    ├── content/
    │   ├── works/*.md       … ★実績はここに1件1ファイル
    │   └── news/*.md        … ★お知らせはここに1件1ファイル
    ├── data/site.ts         … ★固定文言（名前・プロフィール・スキル）
    ├── layouts/BaseLayout.astro
    ├── components/
    │   ├── PageShell.astro      … 全ページ共通の外枠
    │   ├── Header.astro / Footer.astro
    │   ├── Hero.astro / PageHead.astro
    │   ├── Section.astro        … 01〜05 共通の枠組み
    │   ├── Profile.astro / Skills.astro
    │   ├── Works.astro / WorkCard.astro
    │   ├── News.astro / NewsRow.astro
    │   └── Contact.astro
    ├── pages/
    └── styles/global.css        … デザイントークン＋全スタイル
```

## 編集の入り口

| やりたいこと | 触るファイル |
| --- | --- |
| 実績を追加・編集 | `src/content/works/` に `.md` を追加 |
| お知らせを追加・編集 | `src/content/news/` に `.md` を追加 |
| 名前・プロフィール・スキル | `src/data/site.ts` |
| 色・余白・フォント | `src/styles/global.css` の `:root` |
| セクションの並び替え | `src/pages/index.astro` |
| 画像の差し替え | `public/assets/` |

### 実績を1件追加する

`src/content/works/新しい案件.md` を作るだけで、一覧・カルーセル・詳細ページ・サイトマップにすべて反映されます。ファイル名がそのまま URL（`/works/新しい案件`）になります。

```md
---
title: "案件名"
tag: "コーポレートサイト"        # サムネイル左上のバッジ
category: "Web Design"          # カード下部のチップ
note: ""                        # 画像を入れたら空でOK
image: "thumb.png"              # public/assets/ 配下のファイル名
gradient: "linear-gradient(150deg,#EDEFFB,#E4E8F9)"
order: 1                        # 小さいほど先頭
featured: true                  # トップのカルーセルに出すか
role: "デザイン / コーディング"
period: "2025.03 - 2025.05"
stack: ["Figma", "HTML", "CSS"]
summary: "一覧とOGPに使う1〜2文の説明。"
draft: false                    # true にすると公開されません
# externalUrl: "https://..."    # 指定すると詳細ページではなく外部サイトへ
---

## 背景
本文は Markdown で自由に書けます。
```

`draft: true` にした記事はビルド対象から外れるので、書きかけを置いたままデプロイできます。カルーセルのページ送りドットは枚数から自動計算されるため、何件増やしても調整は不要です。

## お問い合わせフォーム

静的サイトなので送信先が必要です。`.env` に設定してください。

```bash
cp .env.example .env
# PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

- **設定あり** … その URL へ `FormData` を POST し、成功／失敗メッセージを表示
- **設定なし** … 入力内容を本文に入れてメーラーを起動するフォールバックが動作

Formspree、Basin、Cloudflare Workers など FormData を受け取れるものなら何でも使えます。

## 元HTMLからの変更点

**独自構文の置き換え**

| 変換前（DC書き出し） | 変換後 |
| --- | --- |
| `<x-dc>` / `<helmet>` / `support.js` | Astro のレイアウトに統合 |
| `<sc-if value="{{ showGrid }}">` | 通常の要素として常時描画 |
| `style-hover` / `style-focus` 属性 | CSS の `:hover` / `:focus` |
| `{{ dot0 }}` `onClick="{{ next }}"` | `data-*` 属性＋通常の `<script>` |
| `ref="{{ trackRef }}"` と React ロジック | 素の DOM API に書き直し |
| 全要素のインラインスタイル | `global.css` のクラスに集約 |
| ハードコードされた実績・お知らせ | Content Collections（Markdown） |
| GSAP + ScrollTrigger の演出 | CSS アニメーション＋素の DOM API |
| バンドル内の base64 埋め込み画像 | `public/assets/` の webp / png |

**修正した点**

- `document.body.style.zoom` で全体を縮小していたレスポンシブ対応を廃止し、1280 / 1180 / 1000 / 760px のブレークポイントで組み直しました。モバイルではハンバーガーメニューになります。
- グリッドの子要素が `min-width: auto` のままだったため、1000〜1180px でスキルカードが画面外にはみ出していました。`minmax(0, 1fr)` と `min-width: 0` で修正しています。
- カルーセルはページ数を固定4で計算していたため、画面幅で表示枚数が変わると破綻していました。カード幅から都度算出する方式に変更しています。
- スクロールリベールは一気にスクロールするとセクションが表示されないままになる場合があったため、取りこぼさない方式に変更しました。
- すべての `href="#"` を実在するページに繋ぎ直しました。
- `<h1>` が無く見出しレベルが飛んでいたので整理し、フォーム入力に `label`、装飾要素に `aria-hidden` を付けました。
- `prefers-reduced-motion` とキーボードフォーカスリングに対応しています。

**ヒーローについて**

ヒーローは文字ではなく、設計図イラストと手描きロゴを重ねた画像構成です（`Kotaro_Ozawa_Portfolio.html` のバンドルから復元）。

- 図面が左上から描かれていくスイープ演出は、元は GSAP でしたが CSS の `@property --sweep` とマスクで再現しています。`@property` 非対応ブラウザでは最初から全体が表示されます。
- スクロール時のパララックス（`translateY` と減光）も元の GSAP と同じ値で再現しています。
- 位置とサイズはキャンバス 1284 x 825 に対する `%` で `site.ts` に定義しているので、画面幅が変わっても比率を保ちます。元デザインの `document.body.style.zoom` は使っていません。
- 手描きロゴは元データに3枚（同一画像）配置されていたため、そのまま再現しています。1枚目が `<h1>` になります。減らす場合は `site.ts` の `hero.wordmarks` から削ってください。
- 1440px では右端のロゴが画面外へ数十pxはみ出します。これは元データの座標どおりで、横スクロールは発生しません。
- 1000px 以下では重ね合わせをやめ、図面を1枚絵として表示してロゴを下に置く構成に切り替わります。
- 画像は webp と png を `<picture>` で出し分けています（図面 1.8MB → 104KB、ロゴ 1.1MB → 111KB）。

**確認していただきたい点**

- 実績6件とお知らせ3件は元HTMLのサンプル名のままです。本文は「背景 / アプローチ / 結果」の雛形に `（要編集）` を入れてあるので、実案件に差し替えてください。
- Contact のメール表示が `kotaro@example.com`、リンク先が `k.ozawa.hp@gmail.com` と食い違っていました。`site.ts` の `emailLabel` を実アドレスに直してください。
- 未使用のまま残してある画像があります（`illust_hero.png` / `soft_gradient_shape.png` / `card_work_thumbnail.png` / `icon_instagram.png`）。不要なら `public/assets/` から削除して構いません。

## デプロイ

`npm run build` の出力（`dist/`）をそのまま置けます。

- **Vercel / Netlify** … リポジトリを繋ぐだけで自動判別されます
- **GitHub Pages** … サブディレクトリ配信の場合は `astro.config.mjs` に `base: '/リポジトリ名'` を追加してください

公開前に `astro.config.mjs` の `site` と `public/robots.txt` のドメインを実際のものに変更してください（canonical・OGP・サイトマップに使われます）。

## microCMS に切り替える場合

Markdown をやめて microCMS で管理する場合も、コンポーネント側は変更不要です。`content.config.ts` のローダーを差し替えるだけで済みます。

```ts
const news = defineCollection({
  loader: async () => {
    const res = await fetch('https://xxxx.microcms.io/api/v1/news?limit=100', {
      headers: { 'X-MICROCMS-API-KEY': import.meta.env.MICROCMS_API_KEY },
    });
    const { contents } = await res.json();
    return contents.map((c) => ({ id: c.id, ...c }));
  },
  schema: /* 既存のまま */,
});
```
