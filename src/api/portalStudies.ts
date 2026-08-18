import type { PortalStudyContentSection, PortalStudyRecord } from "../components/portal/portalStudiesData"
import { useGetData } from "./useQueries"

interface ApiArticleAuthor {
    _id?: string
    email?: string | null
    companyName?: string | null
    country?: string | null
    city?: string | null
    website?: string | null
    logoUrl?: string | null
}

interface ApiArticleSummary {
    _id: string
    title?: string | null
    excerpt?: string | null
    category?: string | null
    tags?: string[] | null
    views?: number | null
    isPublished?: boolean | null
    createdAt?: string | null
    updatedAt?: string | null
    author?: ApiArticleAuthor | null
}

interface ApiArticleDetail extends ApiArticleSummary {
    content?: string | null
    coverImage?: string | null
}

interface ApiArticlesResponse<TItem> {
    data?: TItem[]
    total?: number
}

export function usePortalCompanyStudies(enabled = true) {
    const query = useGetData<ApiArticlesResponse<ApiArticleSummary>>(
        "/articles/company",
        {},
        {
            enabled,
            queryKey: ["portal-company-studies"],
        },
    )

    return {
        ...query,
        studies: (query.data?.data ?? []).map(mapArticleSummaryToStudyRecord),
        total: query.data?.total ?? 0,
    }
}

export function usePortalCompanyStudy(
    articleId: string | null,
    enabled = true,
) {
    const query = useGetData<ApiArticleDetail>(
        articleId ? `/articles/company/${encodeURIComponent(articleId)}` : null,
        {},
        {
            enabled: enabled && Boolean(articleId),
            queryKey: ["portal-company-study", articleId],
        },
    )

    return {
        ...query,
        study: query.data ? mapArticleDetailToStudyRecord(query.data) : null,
    }
}

function mapArticleSummaryToStudyRecord(
    article: ApiArticleSummary,
): PortalStudyRecord {
    const excerpt = resolveExcerpt(article.excerpt, article.title)
    const companyName = resolveCompanyName(article.author)

    return {
        id: article._id,
        companyName,
        studyTitle: formatText(article.title, "مقالة مهنية"),
        excerpt,
        publishedAt: formatDisplayDate(article.createdAt),
        readTime: estimateReadTime(excerpt),
        region: resolveRegion(article.author),
        tags: resolveTags(article.tags, article.category),
        intro: excerpt,
        keyStats: buildKeyStats(article),
        sections: [
            {
                id: `${article._id}-summary`,
                heading: "ملخص المقال",
                paragraphs: [excerpt],
            },
        ],
    }
}

function mapArticleDetailToStudyRecord(article: ApiArticleDetail): PortalStudyRecord {
    const content = formatText(article.content)
    const excerpt = resolveExcerpt(article.excerpt, content || article.title)

    return {
        id: article._id,
        companyName: resolveCompanyName(article.author),
        studyTitle: formatText(article.title, "مقالة مهنية"),
        excerpt,
        publishedAt: formatDisplayDate(article.createdAt),
        readTime: estimateReadTime(content || excerpt),
        region: resolveRegion(article.author),
        tags: resolveTags(article.tags, article.category),
        intro: content ? extractIntro(content) : excerpt,
        keyStats: buildKeyStats(article),
        sections: parseStudySections(article._id, content || excerpt),
    }
}

function parseStudySections(
    articleId: string,
    content: string,
): PortalStudyContentSection[] {
    const normalizedContent = formatText(content)

    if (!normalizedContent) {
        return [
            {
                id: `${articleId}-empty`,
                heading: "المحتوى الكامل",
                paragraphs: ["لا يوجد محتوى متاح لهذه المقالة حالياً."],
            },
        ]
    }

    const rawBlocks = normalizedContent
        .split(/\n\s*\n/g)
        .map((block) => block.trim())
        .filter(Boolean)

    const sections: PortalStudyContentSection[] = []
    let currentHeading = "المحتوى الكامل"
    let currentParagraphs: string[] = []
    let currentBullets: string[] = []
    let sectionIndex = 0

    function flushCurrentSection() {
        if (!currentParagraphs.length && !currentBullets.length) {
            return
        }

        sections.push({
            id: `${articleId}-section-${sectionIndex + 1}`,
            heading: currentHeading,
            paragraphs: currentParagraphs.length
                ? currentParagraphs
                : ["لا يوجد نص تفصيلي ضمن هذا القسم."],
            bullets: currentBullets.length ? currentBullets : undefined,
        })

        sectionIndex += 1
        currentParagraphs = []
        currentBullets = []
    }

    rawBlocks.forEach((block) => {
        const headingMatch = block.match(/^(#{1,3}\s*|##\s*)(.+)$/)
        const bulletLines = block
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)

        const isBulletBlock =
            bulletLines.length > 0 &&
            bulletLines.every((line) => /^[-*•]\s+/.test(line))

        if (headingMatch) {
            flushCurrentSection()
            currentHeading = headingMatch[2].trim() || "قسم جديد"
            return
        }

        if (isBulletBlock) {
            currentBullets.push(
                ...bulletLines.map((line) => line.replace(/^[-*•]\s+/, "").trim()),
            )
            return
        }

        currentParagraphs.push(block.replace(/\n+/g, " ").trim())
    })

    flushCurrentSection()

    if (sections.length > 0) {
        return sections
    }

    return [
        {
            id: `${articleId}-section-1`,
            heading: "المحتوى الكامل",
            paragraphs: [normalizedContent.replace(/\n+/g, " ").trim()],
        },
    ]
}

function buildKeyStats(article: ApiArticleSummary) {
    return [
        {
            label: "عدد المشاهدات",
            value: `${typeof article.views === "number" ? article.views : 0}`,
        },
        {
            label: "التصنيف",
            value: formatText(article.category, "عام"),
        },
        {
            label: "حالة النشر",
            value: article.isPublished === false ? "غير منشور" : "منشور",
        },
    ]
}

function resolveCompanyName(author?: ApiArticleAuthor | null) {
    return formatText(author?.companyName || author?.email, "الشركة الناشرة")
}

function resolveRegion(author?: ApiArticleAuthor | null) {
    const city = formatText(author?.city)
    const country = formatText(author?.country)

    if (city && country) {
        return `${city} - ${country}`
    }

    return city || country || "غير محدد"
}

function resolveExcerpt(...values: Array<string | null | undefined>) {
    const candidate = values
        .map((value) => formatText(value))
        .find((value) => value.length > 0)

    if (!candidate) {
        return "لا يوجد ملخص متاح لهذه المقالة حالياً."
    }

    return candidate.length <= 180
        ? candidate
        : `${candidate.slice(0, 177).trim()}...`
}

function resolveTags(
    tags?: string[] | null,
    category?: string | null,
) {
    const normalizedTags =
        tags
            ?.map((tag) => formatText(tag))
            .filter(Boolean)
            .slice(0, 4) ?? []

    if (normalizedTags.length > 0) {
        return normalizedTags
    }

    const normalizedCategory = formatText(category)
    return normalizedCategory ? [normalizedCategory] : ["مقالة مهنية"]
}

function extractIntro(content: string) {
    const paragraphs = content
        .split(/\n\s*\n/g)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)

    return paragraphs[0] ?? "اطلع على هذه المقالة لمعرفة التفاصيل الكاملة."
}

function estimateReadTime(content: string) {
    const wordCount = content
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    const minutes = Math.max(1, Math.ceil(wordCount / 180))

    return `${minutes} دقيقة`
}

function formatDisplayDate(value?: string | null) {
    if (!value) {
        return "غير محدد"
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return "غير محدد"
    }

    return new Intl.DateTimeFormat("ar", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date)
}

function formatText(value?: string | null, fallback = "") {
    const normalizedValue = `${value ?? ""}`.replace(/\s+/g, " ").trim()
    return normalizedValue || fallback
}
