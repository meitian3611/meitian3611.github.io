import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z.object({
		// ===== 用户可配置的字段 =====

		
		title: z.string(), 										// 文章标题（必填）
		published: z.date(),									// 发布日期（必填）
		updated: z.date().optional(),						    // 更新日期（可选，未写则不显示）
		draft: z.boolean().optional().default(false),			// 是否草稿（可选，默认 false；true 的文章在生产环境构建时会被过滤掉）
		description: z.string().optional().default(""),			// 文章摘要（可选，默认空字符串）
		image: z.string().optional().default(""),				// 封面图路径（可选，默认空字符串）
		tags: z.array(z.string()).optional().default([]),		// 标签列表（可选，默认空数组）
		category: z.string().optional().nullable().default(""), // 分类（可选，可为 null，默认空字符串）
		lang: z.string().optional().default(""),			    // 文章语言（可选，默认空字符串）

		// ===== 内部字段（构建时自动填充，无需手动编写） =====
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});
const specCollection = defineCollection({
	schema: z.object({}),
});
export const collections = {
	posts: postsCollection,
	spec: specCollection,
};
