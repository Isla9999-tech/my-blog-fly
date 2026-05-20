import type { Language, SiteConfig } from './types';

const configZhCN = {
    title: "Isla的博客",
    description: "既然都“相信”二次元了，那么最不该放弃的，应该是梦想吧~",
    keywords: "博客,技术,生活",
    author: "Isla",
    copy: {
        enable: true,
        copyright: {
            enable: false,
            limit_count: 50
        }
    },
    language: "zh-CN" as const,
    source_dir: "source",
    public_dir: "public",
    tag_dir: "tags",
    archive_dir: "archives",
    category_dir: "categories",
    subtitle: {
        enable: true,
        effect: true,
        typed_option: null,
        source: false,
        sub: [
            "生命不息，折腾不止",
            "记录生活、技术与思考"
        ]
    },
    menu: {
        "归档": "/zh-CN/archives/ || fas fa-archive",
        "分类": "/zh-CN/categories/ || fas fa-folder-open",
        "友链&私人收藏": "/zh-CN/link/ || fas fa-link",
        "留言板": "/zh-CN/board/ || fas fa-user",
        "语言||fas fa-language": {
            "中文": "/zh-CN/ || fas fa-c",
            "English": "/en/ || fas fa-e"
        },
    },
    aside: {
        card_announcement: {
            content: "欢迎来访，博客建设中..."
        }
    },
    date_format: "YYYY-MM-DD",
    per_page: 10
} satisfies SiteConfig;

const configEn = {
    title: "Isla9999's Blog",
    description: "Never stop exploring",
    keywords: "blog,tech,life",
    author: "Isla9999",
    copy: {
        enable: true,
        copyright: {
            enable: false,
            limit_count: 50
        }
    },
    language: "en" as const,
    source_dir: "source",
    public_dir: "public",
    tag_dir: "tags",
    archive_dir: "archives",
    category_dir: "categories",
    subtitle: {
        enable: true,
        effect: true,
        typed_option: null,
        source: false,
        sub: [
            "Never stop exploring",
            "Recording life, tech and thoughts"
        ]
    },
    menu: {
        "Archives": "/en/archives/ || fas fa-archive",
        "Categories": "/en/categories/ || fas fa-folder-open",
        "Friends & Personal Collection": "/en/link/ || fas fa-link",
        "Board": "/en/board/ || fas fa-user",
        "Language||fas fa-language": {
            "中文": "/zh-CN/ || fas fa-c",
            "English": "/en/ || fas fa-e"
        },
    },
    aside: {
        card_announcement: {
            content: "Welcome! Blog under construction..."
        }
    },
    date_format: "YYYY-MM-DD",
    per_page: 10
} satisfies SiteConfig;

export const getConfig = (language: Language): SiteConfig => {
    switch (language) {
        case 'zh-CN':
            return configZhCN;
        case 'en':
            return configEn;
        default:
            return configZhCN;
    }
};
