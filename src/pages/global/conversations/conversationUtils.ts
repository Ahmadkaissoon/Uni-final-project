import type {
    ConversationMessage,
    ConversationPreset,
    ConversationRole,
    ConversationThread,
} from "./conversationTypes"

const STORAGE_VERSION = 1

interface StoredConversationPayload {
    version: number
    threads: ConversationThread[]
}

export const conversationPresetsByRole: Record<
    ConversationRole,
    ConversationPreset
> = {
    user: {
        emptyStateTitle: "ابدأ محادثة جديدة",
        emptyStateDescription:
            "اسأل عن الوظائف المناسبة، تحسين السيرة الذاتية، التحضير للمقابلات، أو خطوات التقديم.",
        composerPlaceholder: "اكتب سؤالك هنا...",
        typingLabel: "المساعد يجهز الرد...",
        suggestions: [
            {
                id: "user-cv",
                label: "تحسين السيرة الذاتية",
                prompt: "كيف أحسن السيرة الذاتية حتى تكون مناسبة لفرص العمل؟",
            },
            {
                id: "user-interview",
                label: "التحضير للمقابلة",
                prompt: "كيف أستعد لمقابلة عمل لوظيفة تقنية؟",
            },
            {
                id: "user-jobs",
                label: "وظائف مناسبة",
                prompt: "ما الوظائف المناسبة لشخص لديه خبرة سنة في التصميم؟",
            },
            {
                id: "user-cover-letter",
                label: "رسالة تعريف",
                prompt: "اكتب لي هيكل رسالة تعريف قصيرة للتقديم على وظيفة.",
            },
        ],
    },
    company: {
        emptyStateTitle: "ابدأ محادثة جديدة",
        emptyStateDescription:
            "اسأل عن صياغة الوظائف، تقييم المتقدمين، بناء خطة تدريب، أو تحسين تجربة التوظيف داخل الشركة.",
        composerPlaceholder: "اكتب سؤالك هنا...",
        typingLabel: "المساعد يجهز الرد...",
        suggestions: [
            {
                id: "company-job-post",
                label: "كتابة وصف وظيفي",
                prompt: "كيف أكتب وصفًا وظيفيًا واضحًا وجذابًا لمصمم UI/UX؟",
            },
            {
                id: "company-screening",
                label: "فرز المتقدمين",
                prompt: "ما أفضل طريقة لفرز المتقدمين بسرعة قبل المقابلات؟",
            },
            {
                id: "company-interview",
                label: "أسئلة المقابلة",
                prompt: "اقترح أسئلة مقابلة لوظيفة Frontend Developer مستوى متوسط.",
            },
            {
                id: "company-training",
                label: "خطة تدريب",
                prompt: "كيف أبني خطة تدريب داخلي لمدة 8 أسابيع داخل الشركة؟",
            },
        ],
    },
}

export function getConversationStorageKey(role: ConversationRole) {
    return `portal-conversations:${role}`
}

export function loadConversations(storageKey: string) {
    if (typeof window === "undefined") {
        return [] as ConversationThread[]
    }

    try {
        const rawValue = window.localStorage.getItem(storageKey)

        if (!rawValue) {
            return []
        }

        const parsed = JSON.parse(rawValue) as
            | StoredConversationPayload
            | ConversationThread[]

        const threads = Array.isArray(parsed) ? parsed : parsed.threads

        if (!Array.isArray(threads)) {
            return []
        }

        return sortConversations(
            threads.filter(
                (thread) =>
                    typeof thread?.id === "string" &&
                    Array.isArray(thread.messages),
            ),
        )
    } catch {
        return []
    }
}

export function saveConversations(
    storageKey: string,
    threads: ConversationThread[],
) {
    if (typeof window === "undefined") {
        return
    }

    const payload: StoredConversationPayload = {
        version: STORAGE_VERSION,
        threads,
    }

    window.localStorage.setItem(storageKey, JSON.stringify(payload))
}

export function sortConversations(threads: ConversationThread[]) {
    return [...threads].sort(
        (firstThread, secondThread) =>
            new Date(secondThread.updatedAt).getTime() -
            new Date(firstThread.updatedAt).getTime(),
    )
}

export function createConversationTitle(text: string) {
    const normalizedText = text.replace(/\s+/g, " ").trim()

    if (!normalizedText) {
        return "محادثة جديدة"
    }

    if (normalizedText.length <= 44) {
        return normalizedText
    }

    return `${normalizedText.slice(0, 44).trimEnd()}...`
}

export function createConversationMessage(
    role: ConversationMessage["role"],
    text: string,
): ConversationMessage {
    return {
        id: createId("message"),
        role,
        text,
        createdAt: new Date().toISOString(),
    }
}

export function createConversationThread(
    firstMessage: ConversationMessage,
): ConversationThread {
    const now = new Date().toISOString()

    return {
        id: createId("conversation"),
        title: createConversationTitle(firstMessage.text),
        createdAt: now,
        updatedAt: now,
        messages: [firstMessage],
    }
}

export function buildAssistantReply(
    role: ConversationRole,
    question: string,
) {
    const normalizedQuestion = question.toLowerCase()

    if (role === "user") {
        if (
            includesAny(normalizedQuestion, [
                "cv",
                "resume",
                "سيرة",
                "السيرة",
                "السيره",
            ])
        ) {
            return [
                "حتى تكون السيرة الذاتية أقوى، ابدأ بهذه الخطوات:",
                "1. اكتب ملخصًا مهنيًا من سطرين يوضح تخصصك وخبرتك.",
                "2. رتّب الخبرات والمشاريع من الأحدث إلى الأقدم مع نتائج واضحة.",
                "3. أضف المهارات المهمة للوظيفة نفسها بدل سرد عام طويل.",
                "إذا أردت، أستطيع مساعدتك في صياغة قسم محدد من السيرة.",
            ].join("\n")
        }

        if (
            includesAny(normalizedQuestion, [
                "مقابلة",
                "مقابله",
                "interview",
            ])
        ) {
            return [
                "للتحضير الجيد للمقابلة:",
                "1. راجع وصف الوظيفة وحدد المهارات التي يريدها صاحب العمل.",
                "2. حضّر 3 أمثلة من خبراتك أو مشاريعك توضح طريقة تفكيرك.",
                "3. جهّز أسئلة ذكية عن الفريق، الدور، وآلية التقييم.",
                "إذا أحببت، أقدر أبني لك أسئلة تدريبية مع إجابات مقترحة.",
            ].join("\n")
        }

        if (
            includesAny(normalizedQuestion, [
                "وظيفة",
                "وظائف",
                "job",
                "jobs",
                "مناسبة",
            ])
        ) {
            return [
                "حتى نحدد الوظائف المناسبة لك بدقة، ركّز على:",
                "1. المجال الأساسي الذي تريد العمل فيه.",
                "2. مستوى الخبرة الحالي لديك.",
                "3. نوع الدوام أو المدينة المفضلة.",
                "أرسل لي هذه الثلاثة وسأرتب لك ترشيحات أوضح.",
            ].join("\n")
        }

        if (
            includesAny(normalizedQuestion, [
                "رسالة",
                "تعريف",
                "cover",
                "email",
            ])
        ) {
            return [
                "رسالة التقديم الجيدة تكون بسيطة ومباشرة:",
                "1. سطر افتتاحي يوضح الوظيفة التي تتقدم لها.",
                "2. فقرة قصيرة عن خبرتك أو مشروع يثبت ملاءمتك.",
                "3. سطر ختامي يدعو لمراجعة السيرة أو ترتيب مقابلة.",
                "إذا أردت، أكتب لك نموذجًا جاهزًا حسب تخصصك.",
            ].join("\n")
        }

        return [
            "أستطيع مساعدتك في البحث الوظيفي بشكل أسرع إذا ذكرت لي:",
            "1. التخصص أو المجال الذي تستهدفه.",
            "2. مستوى الخبرة أو آخر مشروع عملت عليه.",
            "3. نوع المساعدة التي تريدها: سيرة، مقابلة، تقديم، أو اختيار وظيفة.",
        ].join("\n")
    }

    if (
        includesAny(normalizedQuestion, [
            "وصف",
            "وظيفي",
            "job description",
            "jd",
            "إعلان",
        ])
    ) {
        return [
            "الوصف الوظيفي الأقوى عادة يحتوي على:",
            "1. مقدمة قصيرة عن الشركة والدور.",
            "2. مسؤوليات واضحة وقابلة للقياس.",
            "3. متطلبات أساسية ومتطلبات مفضلة بشكل منفصل.",
            "4. معلومات الدوام والموقع وآلية التقديم.",
            "إذا أردت، أقدر أبني لك قالبًا كاملًا حسب المسمى الوظيفي.",
        ].join("\n")
    }

    if (
        includesAny(normalizedQuestion, [
            "فرز",
            "screen",
            "تقييم",
            "متقدم",
            "متقدمين",
            "مرشح",
            "candidate",
        ])
    ) {
        return [
            "لفرز المتقدمين بشكل عملي:",
            "1. حدّد 3 معايير أساسية لا يمكن التنازل عنها.",
            "2. استخدم نموذج تقييم موحد لكل مرشح.",
            "3. افصل بين الفرز الأولي والسلوك أثناء المقابلة الفنية.",
            "إذا رغبت، أرتب لك scorecard بسيطًا لاستخدامه مع فريقك.",
        ].join("\n")
    }

    if (
        includesAny(normalizedQuestion, [
            "مقابلة",
            "interview",
            "أسئلة",
            "اسئلة",
        ])
    ) {
        return [
            "حتى تكون المقابلة مفيدة للشركة:",
            "1. ابدأ بأسئلة تقيس الفهم العملي وليس الحفظ.",
            "2. اسأل عن موقف فعلي واجهه المرشح وكيف تصرف.",
            "3. خصص جزءًا قصيرًا لاختبار التواصل وترتيب الأولويات.",
            "إذا أردت، أقدر أجهز لك مجموعة أسئلة حسب الوظيفة والمستوى.",
        ].join("\n")
    }

    if (
        includesAny(normalizedQuestion, [
            "تدريب",
            "internship",
            "train",
            "برنامج",
        ])
    ) {
        return [
            "لإنشاء برنامج تدريب ناجح داخل الشركة:",
            "1. حدّد هدفًا واضحًا لكل أسبوع أو مرحلة.",
            "2. عيّن مشرفًا مباشرًا مع مهام صغيرة قابلة للتسليم.",
            "3. اجعل التقييم مبنيًا على مخرجات حقيقية لا على الحضور فقط.",
            "إذا رغبت، أبني لك خطة تدريب أسبوعية جاهزة.",
        ].join("\n")
    }

    return [
        "أستطيع مساعدتك في التوظيف أو التدريب إذا شاركتني بالمطلوب بدقة:",
        "1. هل تريد إنشاء وظيفة أم تقييم مرشحين أم تنظيم برنامج تدريب؟",
        "2. ما المسمى الوظيفي أو الفريق المعني؟",
        "3. ما النتيجة التي تريد الوصول إليها في هذه الخطوة؟",
    ].join("\n")
}

export function formatConversationDate(dateValue: string) {
    try {
        return new Intl.DateTimeFormat("ar", {
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "2-digit",
        }).format(new Date(dateValue))
    } catch {
        return ""
    }
}

function includesAny(text: string, keywords: string[]) {
    return keywords.some((keyword) => text.includes(keyword))
}

function createId(prefix: string) {
    const randomId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

    return `${prefix}-${randomId}`
}
