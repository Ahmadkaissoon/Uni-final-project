import { SendHorizontal } from "lucide-react"
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

const initialThreadTitles = [
    "توقعات الأسعار خلال السنتين القادمة ....",
    "توقعات الأسعار خلال السنتين القادمة ....",
    "توقعات الأسعار خلال السنتين القادمة ....",
    "توقعات الأسعار خلال السنتين القادمة ....",
    "توقعات الأسعار خلال السنتين القادمة ....",
    "توقعات الأسعار خلال السنتين القادمة ....",
]

const GUIDANCE_STORAGE_VERSION = "v2"

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

function createInitialThreads() {
    return initialThreadTitles.map((title, index) =>
        createGuidanceThread(title, [], `guidance-thread-${index + 1}`),
    )
}

function loadStoredThreads(role: PortalRole) {
    if (typeof window === "undefined") {
        return createInitialThreads()
    }

    try {
        const savedValue = window.localStorage.getItem(
            getGuidanceStorageKey(role),
        )

        if (!savedValue) {
            return createInitialThreads()
        }

        const parsedValue = JSON.parse(savedValue) as GuidanceThread[]

        if (!Array.isArray(parsedValue) || parsedValue.length === 0) {
            return createInitialThreads()
        }

        return parsedValue
    } catch {
        return createInitialThreads()
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
            ? "يمكننا تحسين وصف الوظيفة المطلوب ليجذب مرشحين بسير ذاتية أقوى ويقلل الطلبات غير المناسبة."
            : "ابدأ بإبراز المهارات والإنجازات القابلة للقياس، ثم رتّب خبراتك من الأحدث إلى الأقدم مع نبذة قصيرة قوية."
    }

    if (
        normalizedPrompt.includes("مقابلة") ||
        normalizedPrompt.includes("interview")
    ) {
        return role === "company"
            ? "يمكنني مساعدتك في بناء أسئلة مقابلة أدق وتقييم الإجابات وفق المهارات التي تحتاجها الوظيفة."
            : "يمكنني مساعدتك في تحضير أسئلة المقابلة المتوقعة وصياغة إجابات أقوى حسب مجال عملك."
    }

    if (
        normalizedPrompt.includes("وظيفة") ||
        normalizedPrompt.includes("توظيف") ||
        normalizedPrompt.includes("فرصة")
    ) {
        return role === "company"
            ? "لنحدد أولًا نوع المرشح المناسب، ثم نبني إعلانًا أو خطة فرز واضحة تساعد فريقك في الوصول للأشخاص الأنسب."
            : "لنحدد نوع الوظائف المناسبة لك أولًا، ثم نرتب أولوياتك في التقديم ونراجع ما الذي يجب تحسينه في ملفك."
    }

    return role === "company"
        ? "يمكنني مساعدتك في صياغة وظائف أفضل، فرز المتقدمين، وتحسين تجربة التوظيف داخل الشركة خطوة بخطوة."
        : "أنا هنا لمساعدتك في السيرة الذاتية، المقابلات، واختيار فرص العمل الأنسب لك بطريقة عملية وواضحة."
}

function getInitialSelectedThreadId(role: PortalRole) {
    const initialThreads = loadStoredThreads(role)

    return initialThreads[2]?.id ?? initialThreads[0]?.id ?? null
}

export default function PortalCareerGuidanceSection({
    role,
    title = "الإرشاد الوظيفي",
    description = "يمكنك التحدث وسؤال الذكاء الصناعي لمساعدتك خلال هذه الواجهة",
}: PortalCareerGuidanceSectionProps) {
    const [threads, setThreads] = useState<GuidanceThread[]>(() =>
        loadStoredThreads(role),
    )
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
        () => getInitialSelectedThreadId(role),
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

    function handleCreateThread() {
        const newThread = createGuidanceThread("محادثة جديدة")

        setThreads((currentThreads) => [newThread, ...currentThreads])
        setSelectedThreadId(newThread.id)
        setDraft("")
    }

    function handleSendMessage() {
        const trimmedDraft = draft.trim()

        if (!trimmedDraft || isReplying) {
            return
        }

        const userMessage = createGuidanceMessage("user", trimmedDraft)
        let targetThreadId = selectedThreadId

        if (!targetThreadId) {
            const newThread = createGuidanceThread(trimmedDraft, [userMessage])
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
                                      ? trimmedDraft
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
                createAssistantReply(role, trimmedDraft),
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

    return (
        <section className="pb-12 pt-10 sm:pb-18 sm:pt-12" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-10 flex justify-start sm:mb-12">
                        <div className="border-r-[3px] border-warning-color pr-2 text-right">
                            <h1 className="m-0 py-2.5 text-[28px] font-bold leading-[1.3] text-black max-[400px]:text-[24px] sm:text-[32px]">
                                {title}
                            </h1>
                            <p className="mt-4 mb-0 text-base font-medium leading-[1.9] text-black min-[500px]:max-w-4/5 min-[500px]:text-lg sm:text-size24">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 xl:flex-row-reverse xl:items-stretch">
                        <div className="rounded-lg bg-[#343434] p-4 shadow-[0_16px_36px_rgb(0_0_0_/_0.14)] xl:w-[272px] xl:shrink-0">
                            <div className="mb-5 flex items-center justify-between gap-2.5">
                                <button
                                    type="button"
                                    className="inline-flex h-[38px] min-w-[112px] shrink-0 items-center justify-center rounded-[12px] bg-white px-3 text-sm font-bold text-[#3158c7]"
                                >
                                    <img
                                        src={blueLogo}
                                        alt="وظيفتي"
                                        className="mr-1.5 h-5 w-auto"
                                    />
                                    وظيفتي
                                </button>

                                <Button
                                    type="button"
                                    variant="panel"
                                    size="normal"
                                    onClick={handleCreateThread}
                                    className="inline-flex h-[40px] min-w-[118px] shrink-0 items-center justify-center rounded-full border border-[#5fb174] bg-[#5fb174] !px-3.5 !py-1.5 !text-sm !font-bold !text-white hover:!brightness-105"
                                >
                                    دردشة جديدة
                                </Button>
                            </div>

                            <p className="mb-3 text-right text-xs font-bold text-white">
                                المحادثات
                            </p>

                            <div className="space-y-2 xl:max-h-[348px] xl:overflow-y-auto xl:pl-1">
                                {threads.map((thread) => {
                                    const isSelected =
                                        thread.id === selectedThreadId

                                    return (
                                        <button
                                            key={thread.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedThreadId(thread.id)
                                            }
                                            className={
                                                isSelected
                                                    ? "w-full rounded-lg bg-warning-color px-3 py-2 text-right text-xs font-medium text-white transition duration-200"
                                                    : "w-full rounded-lg bg-transparent px-3 py-2 text-right text-xs font-medium text-white/95 transition duration-200 hover:bg-white/8"
                                            }
                                        >
                                            <span className="block truncate">
                                                {thread.title}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="flex flex-1 flex-col rounded-lg bg-[#343434] px-5 py-6 shadow-[0_16px_36px_rgb(0_0_0_/_0.14)] sm:min-h-[360px] sm:px-8 sm:py-8 xl:min-h-[330px] xl:px-12">
                            {selectedThread?.messages.length ? (
                                <div className="flex h-full flex-col">
                                    <div className="mb-6 flex-1 space-y-4 overflow-y-auto pr-1">
                                        {selectedThread.messages.map(
                                            (message) => (
                                                <div
                                                    key={message.id}
                                                    className={
                                                        message.role === "user"
                                                            ? "ml-auto max-w-[85%] rounded-[16px] bg-[#6579c5] px-4 py-3 text-right text-sm leading-7 text-white sm:max-w-[70%]"
                                                            : "mr-auto max-w-[85%] rounded-[16px] bg-white px-4 py-3 text-right text-sm leading-7 text-[#2e2e2e] sm:max-w-[70%]"
                                                    }
                                                >
                                                    {message.text}
                                                </div>
                                            ),
                                        )}

                                        {isReplying ? (
                                            <div className="mr-auto max-w-[85%] rounded-[16px] bg-white px-4 py-3 text-right text-sm text-[#7a7a7a] sm:max-w-[70%]">
                                                جاري تجهيز الإجابة...
                                            </div>
                                        ) : null}
                                    </div>

                                    <GuidanceComposer
                                        value={draft}
                                        onChange={setDraft}
                                        onSubmit={handleSendMessage}
                                        centered={false}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-1 flex-col items-center justify-center text-center">
                                    <h2 className="mb-6 text-[30px] font-bold leading-[1.35] text-white sm:text-[42px]">
                                        كيف يمكنني مساعدتك ؟
                                    </h2>

                                    <GuidanceComposer
                                        value={draft}
                                        onChange={setDraft}
                                        onSubmit={handleSendMessage}
                                        centered
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

interface GuidanceComposerProps {
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    centered?: boolean
}

function GuidanceComposer({
    value,
    onChange,
    onSubmit,
    centered = true,
}: GuidanceComposerProps) {
    return (
        <div
            className={
                centered
                    ? "relative mx-auto w-full max-w-[290px]"
                    : "relative w-full"
            }
        >
            <input
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        event.preventDefault()
                        onSubmit()
                    }
                }}
                placeholder="اسأل هنا ما تريد"
                className="h-[38px] w-full rounded-[12px] border border-white/25 bg-white px-4 pl-11 text-right text-xs text-[#2e2e2e] outline-none placeholder:text-[#b0b0b0]"
            />

            <button
                type="button"
                onClick={onSubmit}
                className="absolute left-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-[#6d6d6d] transition duration-200 hover:bg-black/5"
                aria-label="إرسال السؤال"
            >
                <SendHorizontal className="size-4" />
            </button>
        </div>
    )
}
