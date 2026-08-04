import { defineCollection, z } from 'astro:content';
import { microCMSLoader, imageUrl, csvToArray } from './lib/microcms';

/**
 * 実績（WORKS）
 * microCMSの "works" APIから読み込みます。
 * フィールド仕様は README のセットアップ手順を参照してください。
 */
const works = defineCollection({
  loader: microCMSLoader('works'),
  schema: z.object({
    title: z.string(),
    /** サムネイル左上のバッジ */
    tag: z.string().default(''),
    /** カード下部のチップ */
    category: z.string().default(''),
    /** サムネイル下部の小さな注記。画像を入れたら空にしてOK */
    note: z.string().default(''),
    /** microCMSの画像フィールド */
    image: z
      .union([z.string(), z.object({ url: z.string(), width: z.number().optional(), height: z.number().optional() })])
      .nullish()
      .transform((v) => imageUrl(v)),
    /** カードの背景グラデーション */
    gradient: z.string().default('linear-gradient(150deg,#EDEFFB,#E4E8F9)'),
    /** 数字が小さいほど先頭に表示 */
    order: z.number().default(99),
    /** トップページのカルーセルに出すか */
    featured: z.boolean().default(true),
    /** 外部サイトがある場合はURL。指定すると詳細ページではなくそちらへ飛びます */
    externalUrl: z.string().url().optional().or(z.literal('').transform(() => undefined)),
    role: z.string().optional(),
    period: z.string().optional(),
    /** microCMS側はカンマ区切りテキストで入力（例: "Figma, React, microCMS"） */
    stack: z
      .union([z.string(), z.array(z.string())])
      .nullish()
      .transform((v) => (Array.isArray(v) ? v : csvToArray(v))),
    summary: z.string().default(''),
    draft: z.boolean().default(false),
  }),
});

/**
 * お知らせ（NEWS）
 * microCMSの "news" APIから読み込みます。
 */
const news = defineCollection({
  loader: microCMSLoader('news'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    /** microCMSのセレクトフィールドは複数選択だと配列で返るため、両対応にして先頭の値を使う */
    category: z
      .union([z.enum(['WORKS', 'NEWS', 'BLOG']), z.array(z.enum(['WORKS', 'NEWS', 'BLOG']))])
      .transform((v) => (Array.isArray(v) ? v[0] : v)),
    draft: z.boolean().default(false),
  }),
});

export const collections = { works, news };
