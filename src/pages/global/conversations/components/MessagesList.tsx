import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { Bot, Menu, SendHorizontal, UserRound } from "lucide-react"

import { Button } from "../../../../components/global/ui/button"
import { cn } from "../../../../utils/cn"
import { formatConversationDate } from "../conversationUtils"
import type { ConversationRole, ConversationThread } from "../conversationTypes"

interface MessagesListProps {
    role: ConversationRole
    conversation: ConversationThread
    placeholder: string
    typingLabel: string
    onSendMessage: (message: string) => void
    onOpenHistory: () => void
    showHistoryButton?: boolean
    isReplying?: boolean
}

export default function MessagesList({
    role,
    conversation,
    placeholder,
    typingLabel,
    onSendMessage,
    onOpenHistory,
    showHistoryButton = false,
    isReplying = false,
}: MessagesListProps) {
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const [draftMessage, setDraftMessage] = useState("")

    useEffect(() => {
        const container = messagesContainerRef.current

        if (!container) {
            return
        }

        container.scrollTop = container.scrollHeight
    }, [conversation.messages, isReplying])

    const handleSubmit = () => {
        const nextMessage = draftMessage.trim()

        if (!nextMessage || isReplying) {
            return
        }

        onSendMessage(nextMessage)
        setDraftMessage("")
    }

    const handleEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()
            handleSubmit()
        }
    }

    return (
        <div className="flex min-h-[560px] flex-col rounded-[28px] border border-[#dbe3f0] bg-white shadow-[0_20px_46px_rgb(15_23_42_/_0.08)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#edf2fb] px-4 py-4 sm:px-5">
                <div className="text-right">
                    <h2 className="m-0 text-lg font-bold text-black">
                        {conversation.title}
                    </h2>
                    <p className="mt-1 text-sm text-[#6d7990]">
                        آخر تحديث{" "}
                        {formatConversationDate(conversation.updatedAt)}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="hidden rounded-full bg-[#eef4ff] px-3 py-1 text-[12px] font-semibold text-primary sm:inline-flex">
                        {role === "company" ? "واجهة الشركة" : "واجهة المستخدم"}
                    </span>

                    {showHistoryButton ? (
                        <button
                            type="button"
                            onClick={onOpenHistory}
                            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-[#dbe3f0] bg-[#f8fbff] text-primary transition duration-200 hover:bg-[#eef4ff] lg:hidden"
                            aria-label="فتح سجل المحادثات"
                        >
                            <Menu className="size-5" />
                        </button>
                    ) : null}
                </div>
            </div>

            <div
                ref={messagesContainerRef}
                className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5"
            >
                {conversation.messages.map((message) => (
                    <MessageItem
                        key={message.id}
                        role={message.role}
                        text={message.text}
                    />
                ))}

                {isReplying ? (
                    <div className="flex justify-start">
                        <div className="flex max-w-[780px] items-start gap-3">
                            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eff4ff] text-primary">
                                <Bot className="size-5" />
                            </span>

                            <div className="min-w-[200px] rounded-[22px] bg-[#f6f8fc] px-4 py-3">
                                <p className="m-0 text-sm font-semibold text-[#50627f]">
                                    {typingLabel}
                                </p>
                                <div className="mt-3 grid gap-2">
                                    <div className="h-3 w-32 animate-pulse rounded-full bg-[#d8e3f5]" />
                                    <div className="h-3 w-48 animate-pulse rounded-full bg-[#e5edf9]" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>

            <div className="border-t border-[#edf2fb] p-4 sm:p-5">
                <div className="rounded-[24px] border border-[#dbe3f0] bg-[#fbfdff] p-3">
                    <textarea
                        value={draftMessage}
                        onChange={(event) =>
                            setDraftMessage(event.target.value)
                        }
                        onKeyDown={handleEnter}
                        placeholder={placeholder}
                        disabled={isReplying}
                        rows={3}
                        className="min-h-[96px] w-full resize-none border-0 bg-transparent text-right text-base text-black outline-none placeholder:text-[#94a3b8]"
                    />

                    <div className="mt-3 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="m-0 text-right text-[13px] text-[#7b88a1]">
                            اضغط Enter للإرسال أو Shift + Enter لسطر جديد.
                        </p>

                        <Button
                            type="button"
                            variant="panel"
                            size="normal"
                            onClick={handleSubmit}
                            disabled={!draftMessage.trim() || isReplying}
                            className="inline-flex min-h-[46px] items-center justify-center rounded-[14px] bg-[#5f86dd] px-5! py-2.5! !text-sm font-bold text-white hover:brightness-105"
                        >
                            <SendHorizontal className="ml-2 size-4" />
                            إرسال
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface MessageItemProps {
    role: "user" | "assistant"
    text: string
}

function MessageItem({ role, text }: MessageItemProps) {
    const isUser = role === "user"

    return (
        <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
            <div className="flex max-w-[780px] items-start gap-3">
                {!isUser ? (
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eff4ff] text-primary">
                        <Bot className="size-5" />
                    </span>
                ) : null}

                <div
                    className={cn(
                        "rounded-[22px] px-4 py-3 text-right text-[15px] leading-[1.95] whitespace-pre-line sm:text-base",
                        isUser
                            ? "bg-[#5f86dd] text-white"
                            : "bg-[#f6f8fc] text-black",
                    )}
                >
                    <p className="m-0">{text}</p>
                </div>

                {isUser ? (
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-primary">
                        <UserRound className="size-5" />
                    </span>
                ) : null}
            </div>
        </div>
    )
}
