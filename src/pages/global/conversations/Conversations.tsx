import { useEffect, useMemo, useRef, useState } from "react"
import { MessageSquareText, X } from "lucide-react"

import type { PortalRole } from "../../../components/layout/PortalLayout"
import { Button } from "../../../components/global/ui/button"
import { cn } from "../../../utils/cn"
import AskInterface from "./components/AskInterface"
import ConversationList from "./components/ConversationList"
import MessagesList from "./components/MessagesList"
import {
    buildAssistantReply,
    conversationPresetsByRole,
    createConversationMessage,
    createConversationThread,
    getConversationStorageKey,
    loadConversations,
    saveConversations,
    sortConversations,
} from "./conversationUtils"
import type { ConversationThread } from "./conversationTypes"

interface ConversationsProps {
    role: PortalRole
    title: string
    description: string
}

export default function Conversations({
    role,
    title,
    description,
}: ConversationsProps) {
    const storageKey = getConversationStorageKey(role)
    const preset = conversationPresetsByRole[role]
    const initialConversations = useMemo(
        () => loadConversations(storageKey),
        [storageKey],
    )
    const [conversations, setConversations] =
        useState<ConversationThread[]>(initialConversations)
    const [selectedConversationId, setSelectedConversationId] = useState<
        string | null
    >(initialConversations[0]?.id ?? null)
    const [replyingConversationId, setReplyingConversationId] = useState<
        string | null
    >(null)
    const [isMobileHistoryMounted, setIsMobileHistoryMounted] = useState(false)
    const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState(false)
    const pendingTimeoutRef = useRef<number[]>([])

    const selectedConversation =
        conversations.find(
            (conversation) => conversation.id === selectedConversationId,
        ) ?? null

    useEffect(() => {
        saveConversations(storageKey, conversations)
    }, [conversations, storageKey])

    useEffect(() => {
        return () => {
            pendingTimeoutRef.current.forEach((timeoutId) =>
                window.clearTimeout(timeoutId),
            )
        }
    }, [])

    const handleCreateNew = () => {
        setSelectedConversationId(null)
        closeHistoryPanel()
    }

    const handleSelectConversation = (conversationId: string) => {
        setSelectedConversationId(conversationId)
        closeHistoryPanel()
    }

    const handleRenameConversation = (
        conversationId: string,
        nextTitle: string,
    ) => {
        setConversations((currentConversations) =>
            currentConversations.map((conversation) =>
                conversation.id === conversationId
                    ? {
                          ...conversation,
                          title: nextTitle,
                          updatedAt: new Date().toISOString(),
                      }
                    : conversation,
            ),
        )
    }

    const handleDeleteConversation = (conversationId: string) => {
        setConversations((currentConversations) => {
            const filteredConversations = currentConversations.filter(
                (conversation) => conversation.id !== conversationId,
            )

            if (selectedConversationId === conversationId) {
                setSelectedConversationId(filteredConversations[0]?.id ?? null)
            }

            if (replyingConversationId === conversationId) {
                setReplyingConversationId(null)
            }

            return filteredConversations
        })
    }

    const handleStartConversation = (message: string) => {
        handleSendMessage(message)
        closeHistoryPanel()
    }

    const handleSendMessage = (message: string) => {
        const trimmedMessage = message.trim()

        if (!trimmedMessage) {
            return
        }

        const userMessage = createConversationMessage("user", trimmedMessage)
        const assistantReply = buildAssistantReply(role, trimmedMessage)
        let targetConversationId = selectedConversationId

        if (!targetConversationId) {
            const nextConversation = createConversationThread(userMessage)

            targetConversationId = nextConversation.id
            setSelectedConversationId(nextConversation.id)
            setConversations((currentConversations) =>
                sortConversations([nextConversation, ...currentConversations]),
            )
        } else {
            setConversations((currentConversations) =>
                sortConversations(
                    currentConversations.map((conversation) =>
                        conversation.id === targetConversationId
                            ? {
                                  ...conversation,
                                  updatedAt: userMessage.createdAt,
                                  messages: [
                                      ...conversation.messages,
                                      userMessage,
                                  ],
                              }
                            : conversation,
                    ),
                ),
            )
        }

        if (!targetConversationId) {
            return
        }

        setReplyingConversationId(targetConversationId)

        const timeoutId = window.setTimeout(() => {
            const assistantMessage = createConversationMessage(
                "assistant",
                assistantReply,
            )

            setConversations((currentConversations) =>
                sortConversations(
                    currentConversations.map((conversation) =>
                        conversation.id === targetConversationId
                            ? {
                                  ...conversation,
                                  updatedAt: assistantMessage.createdAt,
                                  messages: [
                                      ...conversation.messages,
                                      assistantMessage,
                                  ],
                              }
                            : conversation,
                    ),
                ),
            )

            setReplyingConversationId((currentConversationId) =>
                currentConversationId === targetConversationId
                    ? null
                    : currentConversationId,
            )
            pendingTimeoutRef.current = pendingTimeoutRef.current.filter(
                (currentTimeoutId) => currentTimeoutId !== timeoutId,
            )
        }, 850)

        pendingTimeoutRef.current.push(timeoutId)
    }

    const openHistoryPanel = () => {
        setIsMobileHistoryMounted(true)
        requestAnimationFrame(() => setIsMobileHistoryOpen(true))
    }

    const closeHistoryPanel = () => {
        setIsMobileHistoryOpen(false)
        window.setTimeout(() => setIsMobileHistoryMounted(false), 240)
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

                    <div className="mb-4 flex justify-end lg:hidden">
                        <Button
                            type="button"
                            variant="outline"
                            size="normal"
                            onClick={openHistoryPanel}
                            className="inline-flex min-h-[44px] items-center justify-center rounded-full px-4! py-2! !text-sm font-bold"
                        >
                            <MessageSquareText className="ml-2 size-4" />
                            سجل المحادثات
                        </Button>
                    </div>

                    <div className="flex flex-col-reverse gap-4 lg:flex-row lg:items-start">
                        <div className="flex-1">
                            {selectedConversation ? (
                                <MessagesList
                                    role={role}
                                    conversation={selectedConversation}
                                    placeholder={preset.composerPlaceholder}
                                    typingLabel={preset.typingLabel}
                                    onSendMessage={handleSendMessage}
                                    onOpenHistory={openHistoryPanel}
                                    showHistoryButton
                                    isReplying={
                                        replyingConversationId ===
                                        selectedConversation.id
                                    }
                                />
                            ) : (
                                <AskInterface
                                    role={role}
                                    title={preset.emptyStateTitle}
                                    description={preset.emptyStateDescription}
                                    placeholder={preset.composerPlaceholder}
                                    suggestions={preset.suggestions}
                                    onStartConversation={
                                        handleStartConversation
                                    }
                                />
                            )}
                        </div>

                        <div className="hidden w-full lg:block lg:w-[320px] xl:w-[360px]">
                            <ConversationList
                                role={role}
                                conversations={conversations}
                                selectedConversationId={selectedConversationId}
                                onSelectConversation={handleSelectConversation}
                                onCreateNew={handleCreateNew}
                                onRenameConversation={handleRenameConversation}
                                onDeleteConversation={handleDeleteConversation}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isMobileHistoryMounted ? (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        className={cn(
                            "absolute inset-0 bg-black/35 transition-opacity duration-200",
                            isMobileHistoryOpen ? "opacity-100" : "opacity-0",
                        )}
                        onClick={closeHistoryPanel}
                        aria-label="إغلاق سجل المحادثات"
                    />

                    <aside
                        className={cn(
                            "absolute right-0 top-0 flex h-full w-[min(88vw,360px)] flex-col bg-white p-4 shadow-[0_20px_60px_rgb(15_23_42_/_0.25)] transition-transform duration-200",
                            isMobileHistoryOpen
                                ? "translate-x-0"
                                : "translate-x-full",
                        )}
                    >
                        <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#edf2fb] pb-4">
                            <button
                                type="button"
                                onClick={closeHistoryPanel}
                                className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-[#dbe3f0] bg-[#f8fbff] text-primary transition duration-200 hover:bg-[#eef4ff]"
                                aria-label="إغلاق"
                            >
                                <X className="size-5" />
                            </button>

                            <div className="text-right">
                                <h2 className="m-0 text-lg font-bold text-black">
                                    المحادثات
                                </h2>
                                <p className="mt-1 text-sm text-[#6d7990]">
                                    اختر محادثة أو ابدأ محادثة جديدة
                                </p>
                            </div>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto">
                            <ConversationList
                                role={role}
                                conversations={conversations}
                                selectedConversationId={selectedConversationId}
                                onSelectConversation={handleSelectConversation}
                                onCreateNew={handleCreateNew}
                                onRenameConversation={handleRenameConversation}
                                onDeleteConversation={handleDeleteConversation}
                                className="border-0 p-0 shadow-none"
                            />
                        </div>
                    </aside>
                </div>
            ) : null}
        </section>
    )
}
