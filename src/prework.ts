import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

type BlogEntry = CollectionEntry<'cn_blog' | 'en_blog'>;

export async function getBlogEntry(lang: string): Promise<BlogEntry[]> {
    let blogEntries: BlogEntry[];
    switch (lang) {
        case 'zh-CN':
            blogEntries = await getCollection('cn_blog');
            break;
        case 'en':
            blogEntries = await getCollection('en_blog');
            break;
        default:
            blogEntries = await getCollection('cn_blog');
    }
    blogEntries.sort((a, b) => new Date(b.data.updated).getTime() - new Date(a.data.updated).getTime());
    return blogEntries;
}

export async function getCategoryList(lang: string): Promise<{ name: string; path: string; count: number }[]> {
    const categoryMap: Record<string, { name: string; path: string; count: number }> = {};
    const blogEntries = await getBlogEntry(lang);
    for (const entry of blogEntries) {
        const category = entry.data.categories;
        if (category) {
            if (!categoryMap[category]) {
                categoryMap[category] = { name: category, path: `/categories/${category}`, count: 0 };
            }
            categoryMap[category].count += 1;
        }
    }
    return Object.values(categoryMap);
}

export async function getArchiveLength(lang: string): Promise<number> {
    const blogEntries = await getBlogEntry(lang);
    return blogEntries.length;
}
