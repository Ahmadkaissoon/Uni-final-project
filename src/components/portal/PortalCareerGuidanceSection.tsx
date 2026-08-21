import {
    Bot,
    BriefcaseBusiness,
    MessageCircle,
    Plus,
    SendHorizontal,
    Sparkles,
    Trash2,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

import blueLogo from "../../assets/icons/blue_logo.png"
import type { PortalRole } from "../layout/PortalLayout"
import { Button } from "../global/ui/button"

type GuidanceActor = "user" | "assistant"

interface GuidanceMessage {
    id: string
    role: GuidanceActor
    text: string
}

interface GuidanceThread {
    id: string
    title: string
    messages: GuidanceMessage[]
}

interface PortalCareerGuidanceSectionProps {
    role: PortalRole
    title?: string
    description?: string
}

const GUIDANCE_STORAGE_VERSION = "v3"

const initialThreadTitlesByRole: Record<PortalRole, string[]> = {
    user: [
        "تحسين السيرة الذاتية",
        "التحضير لمقابلة عمل",
        "اختيار فرصة مناسبة",
    ],
    company: [
        "كتابة وصف وظيفي واضح",
        "فرز المتقدمين بكفاءة",
        "تحسين تجربة المرشحين",
    ],
}

const quickPromptsByRole: Record<PortalRole, string[]> = {
    user: [
        "راجع لي نقاط قوتي في السيرة الذاتية",
        "كيف أستعد لمقابلة Front-End؟",
        "ما نوع الوظائف المناسبة لخبرتي؟",
    ],
    company: [
        "ساعدني أكتب إعلان وظيفة أوضح",
        "كيف أقلل الطلبات غير المناسبة؟",
        "اقترح أسئلة مقابلة عملية",
    ],
}

function getGuidanceStorageKey(role: PortalRole) {
    return `portal-career-guidance:${GUIDANCE_STORAGE_VERSION}:${role}`
}

function createGuidanceThread(
    title: string,
    messages: GuidanceMessage[] = [],
    id?: string,
): GuidanceThread {
    return {
        id: id ?? `${title}-${Math.random().toString(36).slice(2, 10)}`,
        title,
        messages,
    }
}

function createInitialThreads(role: PortalRole) {
    return initialThreadTitlesByRole[role].map((title, index) =>
        createGuidanceThread(title, [], `guidance-thread-${role}-${index + 1}`),
    )
}

function loadStoredThreads(role: PortalRole) {
    if (typeof window === "undefined") {
        return createInitialThreads(role)
    }

    try {
        const savedValue = window.localStorage.getItem(getGuidanceStorageKey(role))

        if (!savedValue) {
            return createInitialThreads(role)
        }

        const parsedValue = JSON.parse(savedValue) as GuidanceThread[]
        return Array.isArray(parsedValue) ? parsedValue : createInitialThreads(role)
    } catch {
        return createInitialThreads(role)
    }
}

function createGuidanceMessage(
    role: GuidanceActor,
    text: string,
): GuidanceMessage {
    return {
        id: `${role}-${Math.random().toString(36).slice(2, 10)}`,
        role,
        text,
    }
}

function createAssistantReply(role: PortalRole, prompt: string) {
    const normalizedPrompt = prompt.trim().toLowerCase()

    if (normalizedPrompt.includes("سيرة") || normalizedPrompt.includes("cv")) {
        return role === "company"
            ? "ابدأ بتحديد المهارات التي يجب أن تظهر في السيرة الذاتية، ثم اجعل الفرز مبنيًا على أمثلة عمل واضحة بدل الاعتماد على العناوين فقط."
            : "ابدأ بملخص قصير يوضح تخصصك وقيمتك، ثم رتّب الخبرات من الأحدث للأقدم، واستخدم أرقامًا أو نتائج ملموسة كلما أمكن."
    }

    if (
        normalizedPrompt.includes("مقابلة") ||
        normalizedPrompt.includes("interview")
    ) {
        return role === "company"
            ? "اقترح أن تقسم المقابلة إلى ثلاثة أجزاء: فهم الخبرة، تمرين عملي قصير، ثم أسئلة سلوكية تقيس طريقة التفكير والتعاون."
            : "حضّر ثلاث قصص قصيرة عن مشاريعك: مشكلة واجهتها، قرار اتخذته، ونتيجة وصلت لها. هذا يجعل إجاباتك أوضح وأقوى."
    }

    if (
        normalizedPrompt.includes("وظيفة") ||
        normalizedPrompt.includes("توظيف") ||
        normalizedPrompt.includes("فرصة")
    ) {
        return role === "company"
            ? "اجعل الإعلان يشرح المسؤوليات اليومية، المهارات الضرورية، ونمط العمل. الوضوح هنا يقلل الطلبات غير المناسبة ويرفع جودة المرشحين."
            : "اختر الفرص التي تطابق مهارتين أساسيتين لديك على الأقل، ثم خصص السيرة ورسالة التقديم حول احتياج الشركة بدل إرسال نسخة واحدة للجميع."
    }

    return role === "company"
        ? "أقدر أساعدك في تحسين الوصف الوظيفي، فرز المتقدمين، بناء أسئلة مقابلة، أو تصميم تجربة توظيف أوضح للمرشحين."
        : "أقدر أساعدك في السيرة الذاتية، المقابلات، اختيار الوظائف المناسبة، أو ترتيب خطة تطوير مهاراتك للمرحلة القادمة."
}

function getInitialSelectedThreadId(role: PortalRole) {
    const initialThreads = loadStoredThreads(role)
    return initialThreads[0]?.id ?? null
}

export default function PortalCareerGuidanceSection({
    role,
    title = "الإرشاد الوظيفي",
    description = "مساحة محادثة ذكية تساعدك على اتخاذ قرارات أوضح في التوظيف والتقديم والتطوير المهني.",
}: PortalCareerGuidanceSectionProps) {
    const [threads, setThreads] = useState<GuidanceThread[]>(() =>
        loadStoredThreads(role),
    )
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(() =>
        getInitialSelectedThreadId(role),
    )
    const [draft, setDraft] = useState("")
    const [isReplying, setIsReplying] = useState(false)
    const replyTimeoutRef = useRef<number | null>(null)

    useEffect(() => {
        window.localStorage.setItem(
            getGuidanceStorageKey(role),
            JSON.stringify(threads),
        )
    }, [role, threads])

    useEffect(() => {
        return () => {
            if (replyTimeoutRef.current !== null) {
                window.clearTimeout(replyTimeoutRef.current)
            }
        }
    }, [])

    const selectedThread =
        threads.find((thread) => thread.id === selectedThreadId) ?? null
    const quickPrompts = quickPromptsByRole[role]

    function handleCreateThread() {
        const newThread = createGuidanceThread("محادثة جديدة")

        setThreads((currentThreads) => [newThread, ...currentThreads])
        setSelectedThreadId(newThread.id)
        setDraft("")
    }

    function handleDeleteThread(threadId: string) {
        setThreads((currentThreads) => {
            const threadIndex = currentThreads.findIndex(
                (thread) => thread.id === threadId,
            )
            const nextThreads = currentThreads.filter(
                (thread) => thread.id !== threadId,
            )

            if (selectedThreadId === threadId) {
                const nextSelectedThread =
                    nextThreads[threadIndex] ?? nextThreads[threadIndex - 1] ?? null

                setSelectedThreadId(nextSelectedThread?.id ?? null)
                setDraft("")
            }

            return nextThreads
        })
    }

    function submitPrompt(prompt: string) {
        const trimmedPrompt = prompt.trim()

        if (!trimmedPrompt || isReplying) {
            return
        }

        const userMessage = createGuidanceMessage("user", trimmedPrompt)
        let targetThreadId = selectedThreadId

        if (!targetThreadId) {
            const newThread = createGuidanceThread(trimmedPrompt, [userMessage])
            targetThreadId = newThread.id
            setThreads((currentThreads) => [newThread, ...currentThreads])
            setSelectedThreadId(newThread.id)
        } else {
            setThreads((currentThreads) =>
                currentThreads.map((thread) =>
                    thread.id === targetThreadId
                        ? {
                              ...thread,
                              title:
                                  thread.title === "محادثة جديدة"
                                      ? trimmedPrompt
                                      : thread.title,
                              messages: [...thread.messages, userMessage],
                          }
                        : thread,
                ),
            )
        }

        setDraft("")
        setIsReplying(true)

        const currentTargetThreadId = targetThreadId
        replyTimeoutRef.current = window.setTimeout(() => {
            const assistantMessage = createGuidanceMessage(
                "assistant",
                createAssistantReply(role, trimmedPrompt),
            )

            setThreads((currentThreads) =>
                currentThreads.map((thread) =>
                    thread.id === currentTargetThreadId
                        ? {
                              ...thread,
                              messages: [...thread.messages, assistantMessage],
                          }
                        : thread,
                ),
            )
            setIsReplying(false)
            replyTimeoutRef.current = null
        }, 700)
    }

    function handleSendMessage() {
        submitPrompt(draft)
    }

    return (
        <section className="pb-12 pt-10 sm:pb-18 sm:pt-12" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
                        <div className="border-r-[3px] border-warning-color pr-4 text-right sm:pr-6">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d9e4f5] bg-white px-4 py-2 text-size13 font-bold text-[#4f6aa8] shadow-[0_8px_20px_rgb(24_53_107_/_0.08)]">
                                <Sparkles className="size-4 text-warning-color" />
                                مساعد مهني ذكي
                            </div>
                            <h1 className="m-0 py-1 text-[30px] font-bold leading-[1.3] text-black sm:text-[38px]">
                                {title}
                            </h1>
                            <p className="mt-4 mb-0 max-w-[52rem] text-size18 font-medium leading-[1.95] text-black sm:text-size22">
                                {description}
                            </p>
                        </div>

                        <div className="rounded-[20px] border border-[#e0e9f6] bg-white p-4 text-right shadow-[0_18px_42px_rgb(26_51_95_/_0.10)]">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex size-11 items-center justify-center rounded-[14px] bg-[#edf5ff]">
                                    <img
                                        src={blueLogo}
                                        alt="وظيفتي"
                                        className="h-7 w-auto"
                                    />
                                </span>
                                <div>
                                    <p className="m-0 text-size15 font-bold text-[#243047]">
                                        وظيفتي AI
                                    </p>
                                    <p className="m-0 text-size13 font-medium text-[#6d788b]">
                                        ردود تجريبية محفوظة محليًا
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
                        <aside className="portal-category-card-shadow rounded-[22px] border border-[#e2ebf6] bg-white p-4 text-right sm:p-5">
                            <div className="mb-5 flex items-center justify-between gap-3">
                                <div>
                                    <p className="m-0 text-size17 font-bold text-[#233047]">
                                        المحادثات
                                    </p>
                                    <p className="mt-1 mb-0 text-size13 font-medium text-[#6c7788]">
                                        {threads.length} محادثة محفوظة
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    variant="panel"
                                    size="normal"
                                    onClick={handleCreateThread}
                                    className="inline-flex min-h-[40px] items-center justify-center rounded-[12px] border border-[#4da76f] bg-[#5ab37b] !px-3 !py-2 !text-size14 !font-bold !text-white hover:!brightness-105"
                                >
                                    <Plus className="ml-2 size-4" />
                                    جديد
                                </Button>
                            </div>

                            <div className="grid gap-2 xl:max-h-[482px] xl:overflow-y-auto xl:pl-1">
                                {threads.map((thread) => {
                                    const isSelected = thread.id === selectedThreadId

                                    return (
                                        <div
                                            key={thread.id}
                                            className={
                                                isSelected
                                                    ? "group flex items-center gap-2 rounded-[14px] border border-[#aac0ee] bg-[#eef5ff] px-3 py-3 text-[#25407e]"
                                                    : "group flex items-center gap-2 rounded-[14px] border border-transparent px-3 py-3 text-[#4d596b] transition duration-200 hover:border-[#e2ebf6] hover:bg-[#f8fbff]"
                                            }
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedThreadId(thread.id)
                                                }
                                                className="flex min-w-0 flex-1 items-center gap-2 bg-transparent p-0 text-right text-size14 font-bold text-inherit"
                                            >
                                                <MessageCircle className="size-4 shrink-0" />
                                                <span className="block truncate">
                                                    {thread.title}
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteThread(thread.id)
                                                }
                                                className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[#b94842] opacity-70 transition duration-200 hover:bg-[#fff1f0] hover:opacity-100"
                                                aria-label="حذف المحادثة"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        </aside>

                        <div className="portal-category-card-shadow flex min-h-[560px] flex-col overflow-hidden rounded-[24px] border border-[#dfe9f6] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)]">
                            <div className="border-b border-[#e6eef8] bg-white px-5 py-4 sm:px-6">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 text-right">
                                        <span className="inline-flex size-11 items-center justify-center rounded-[14px] bg-[#eff6ff] text-[#335cae]">
                                            <Bot className="size-5" />
                                        </span>
                                        <div>
                                            <p className="m-0 text-size17 font-bold text-[#233047]">
                                                {selectedThread?.title ??
                                                    "ابدأ محادثة جديدة"}
                                            </p>
                                            <p className="mt-1 mb-0 text-size13 font-medium text-[#6d788b]">
                                                اطرح سؤالك وسنقترح خطوات عملية
                                            </p>
                                        </div>
                                    </div>

                                    <span className="inline-flex items-center gap-2 rounded-full bg-[#fff7ed] px-3 py-1.5 text-size13 font-bold text-warning-color">
                                        <BriefcaseBusiness className="size-4" />
                                        {role === "company"
                                            ? "إرشاد للشركات"
                                            : "إرشاد للباحثين"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col px-5 py-5 sm:px-6">
                                {selectedThread?.messages.length ? (
                                    <div className="mb-5 flex-1 space-y-4 overflow-y-auto pl-1">
                                        {selectedThread.messages.map((message) => (
                                            <MessageBubble
                                                key={message.id}
                                                message={message}
                                            />
                                        ))}

                                        {isReplying ? (
                                            <div className="flex justify-start">
                                                <div className="rounded-[18px] rounded-br-[6px] border border-[#e2ebf6] bg-white px-4 py-3 text-size15 font-medium text-[#7a8495] shadow-sm">
                                                    جاري تجهيز الإجابة...
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                ) : (
                                    <div className="flex flex-1 flex-col items-center justify-center text-center">
                                        <span className="inline-flex size-16 items-center justify-center rounded-[22px] bg-[#eef5ff] text-[#335cae]">
                                            <Bot className="size-8" />
                                        </span>
                                        <h2 className="mt-5 mb-0 text-[28px] font-bold leading-[1.35] text-[#233047] sm:text-[36px]">
                                            كيف يمكنني مساعدتك؟
                                        </h2>
                                        <p className="mt-3 mb-0 max-w-[34rem] text-size16 font-medium leading-8 text-[#667386]">
                                            اختر اقتراحًا سريعًا أو اكتب سؤالك الخاص
                                            لنبدأ محادثة مهنية واضحة.
                                        </p>

                                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                                            {quickPrompts.map((prompt) => (
                                                <button
                                                    key={prompt}
                                                    type="button"
                                                    onClick={() => submitPrompt(prompt)}
                                                    className="rounded-full border border-[#d8e4f5] bg-white px-4 py-2 text-size14 font-bold text-[#35548f] transition duration-200 hover:border-[#abc0ea] hover:bg-[#f3f7ff]"
                                                >
                                                    {prompt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <GuidanceComposer
                                    value={draft}
                                    disabled={isReplying}
                                    onChange={setDraft}
                                    onSubmit={handleSendMessage}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function MessageBubble({ message }: { message: GuidanceMessage }) {
    const isUser = message.role === "user"

    return (
        <div className={isUser ? "flex justify-end" : "flex justify-start"}>
            <div
                className={
                    isUser
                        ? "max-w-[86%] rounded-[18px] rounded-bl-[6px] bg-[#5f7fd2] px-4 py-3 text-right text-size15 font-medium leading-8 text-white shadow-[0_10px_22px_rgb(58_88_171_/_0.18)] sm:max-w-[72%]"
                        : "max-w-[86%] rounded-[18px] rounded-br-[6px] border border-[#e2ebf6] bg-white px-4 py-3 text-right text-size15 font-medium leading-8 text-[#344055] shadow-sm sm:max-w-[72%]"
                }
            >
                {message.text}
            </div>
        </div>
    )
}

interface GuidanceComposerProps {
    value: string
    disabled?: boolean
    onChange: (value: string) => void
    onSubmit: () => void
}

function GuidanceComposer({
    value,
    disabled = false,
    onChange,
    onSubmit,
}: GuidanceComposerProps) {
    return (
        <div className="relative mt-auto">
            <input
                type="text"
                value={value}
                disabled={disabled}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        event.preventDefault()
                        onSubmit()
                    }
                }}
                placeholder="اسأل هنا ما تريد"
                className="min-h-[52px] w-full rounded-[16px] border border-[#d7e3f5] bg-white px-5 pl-14 text-right text-size16 font-medium text-[#2e3b52] shadow-[inset_0_1px_3px_rgb(30_56_101_/_0.08)] outline-none transition duration-200 placeholder:text-[#9aa7ba] focus:border-[#5f7fd2] disabled:opacity-70"
            />

            <button
                type="button"
                disabled={disabled || !value.trim()}
                onClick={onSubmit}
                className="absolute left-2 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-[12px] bg-warning-color text-white transition duration-200 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="إرسال السؤال"
            >
                <SendHorizontal className="size-5" />
            </button>
        </div>
    )
}
