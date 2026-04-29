import { useState, type KeyboardEvent } from "react"
import { MessageSquareHeart, SendHorizontal, Sparkles } from "lucide-react"

import { Button } from "../../../../components/global/ui/button"
import type {
    ConversationRole,
    ConversationSuggestion,
} from "../conversationTypes"

interface AskInterfaceProps {
    role: ConversationRole
    title: string
    description: string
    placeholder: string
    suggestions: ConversationSuggestion[]
    onStartConversation: (message: string) => void
    isBusy?: boolean
}

export default function AskInterface({
    role,
    title,
    description,
    placeholder,
    suggestions,
    onStartConversation,
    isBusy = false,
}: AskInterfaceProps) {
    const [draftMessage, setDraftMessage] = useState("")

    const submitMessage = () => {
        const nextMessage = draftMessage.trim()

        if (!nextMessage || isBusy) {
            return
        }

        onStartConversation(nextMessage)
        setDraftMessage("")
    }

    const handleEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()
            submitMessage()
        }
    }

    return (
        <div className="rounded-[28px] border border-[#dbe3f0] bg-white p-5 shadow-[0_20px_46px_rgb(15_23_42_/_0.08)] sm:p-8">
            <div className="mx-auto mb-5 inline-flex size-16 items-center justify-center rounded-[22px] bg-[linear-gradient(180deg,#f5f8ff_0%,#ebf0ff_100%)] text-primary sm:mb-6">
                {role === "company" ? (
                    <MessageSquareHeart className="size-8" />
                ) : (
                    <Sparkles className="size-8" />
                )}
            </div>

            <div className="mx-auto max-w-3xl text-center">
                <h2 className="m-0 text-[24px] font-bold text-black sm:text-[30px]">
                    {title}
                </h2>
                <p className="mt-3 text-[15px] leading-[1.9] text-[#5e6a84] sm:text-[17px]">
                    {description}
                </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {suggestions.map((suggestion) => (
                    <button
                        key={suggestion.id}
                        type="button"
                        className="rounded-[18px] border border-[#dbe3f0] bg-[#f8fbff] px-4 py-3 text-right text-sm font-semibold text-[#24406f] transition duration-200 hover:border-[#9ab4ef] hover:bg-[#eef4ff]"
                        onClick={() => onStartConversation(suggestion.prompt)}
                        disabled={isBusy}
                    >
                        {suggestion.label}
                    </button>
                ))}
            </div>

            <div className="mt-8 rounded-[24px] border border-[#dbe3f0] bg-[#fbfdff] p-3 sm:p-4">
                <textarea
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                    onKeyDown={handleEnter}
                    placeholder={placeholder}
                    disabled={isBusy}
                    rows={4}
                    className="min-h-[120px] w-full resize-none border-0 bg-transparent text-right text-base text-black outline-none placeholder:text-[#94a3b8]"
                />

                <div className="mt-3 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="m-0 text-right text-[13px] text-[#7b88a1]">
                        يمكنك إرسال السؤال مباشرة أو اختيار أحد الاقتراحات.
                    </p>

                    <Button
                        type="button"
                        variant="panel"
                        size="normal"
                        onClick={submitMessage}
                        disabled={!draftMessage.trim() || isBusy}
                        className="inline-flex min-h-[46px] items-center justify-center rounded-[14px] bg-[#5f86dd] px-5 py-2.5 !text-sm font-bold text-white hover:brightness-105"
                    >
                        <SendHorizontal className="ml-2 size-4" />
                        ابدأ المحادثة
                    </Button>
                </div>
            </div>
        </div>
    )
}
