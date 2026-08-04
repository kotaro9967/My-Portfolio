import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 実績（WORKS）
 * src/content/works/*.md を1件＝1実績として読み込みます。
 */
const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    /** サムネイル左上のバッジ */
    tag: z.string(),
    /** カード下部のチップ */
    category: z.string(),
    /** サムネイル下部の小さな注記。画像を入れたら空にしてOK */
    note: z.string().default(''),
    /** public/assets/ 配下のファイル名。未指定ならプレースホルダー */
    image: z.string().default('image_placeholder.png'),
    /** カードの背景グラデーション */
    gradient: z.string().default('linear-gradient(150deg,#EDEFFB,#E4E8F9)'),
    /** 数字が小さいほど先頭に表示 */
    order: z.number().default(99),
    /** トップページのカルーセルに出すか */
    featured: z.boolean().default(true),
    /** 外部サイトがある場合はURL。指定すると詳細ページではなくそちらへ飛びます */
    externalUrl: z.string().url().optional(),
    role: z.string().optional(),
    period: z.string().optional(),
    stack: z.array(z.string()).default([]),
    summary: z.string(),
    draft: z.boolean().default(false),
  }),
});

/**
 * お知らせ（NEWS）
 */
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['WORKS', 'NEWS', 'BLOG']),
    draft: z.boolean().default(false),
  }),
});

export const collections = { works, news };
