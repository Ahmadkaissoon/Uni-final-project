import { useState } from "react"
import { MessageSquare, MessageSquarePlus, Pencil, Trash2 } from "lucide-react"

import { Button } from "../../../../components/global/ui/button"
import { cn } from "../../../../utils/cn"
import { formatConversationDate } from "../conversationUtils"
import type { ConversationRole, ConversationThread } from "../conversationTypes"

interface ConversationListProps {
    role: ConversationRole
    conversations: ConversationThread[]
    selectedConversationId: string | null
    onSelectConversation: (id: string) => void
    onCreateNew: () => void
    onRenameConversation: (id: string, title: string) => void
    onDeleteConversation: (id: string) => void
    className?: string
}

export default function ConversationList({
    role,
    conversations,
    selectedConversationId,
    onSelectConversation,
    onCreateNew,
    onRenameConversation,
    onDeleteConversation,
    className,
}: ConversationListProps) {
    return (
        <aside
            className={cn(
                "rounded-[28px] border border-[#dbe3f0] bg-white p-4 shadow-[0_20px_46px_rgb(15_23_42_/_0.08)] sm:p-5",
                className,
            )}
        >
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#edf2fb] pb-4">
                <div className="text-right">
                    <h2 className="m-0 text-lg font-bold text-black">
                        المحادثات
                    </h2>
                    <p className="mt-1 text-sm text-[#6d7990]">
                        {role === "company"
                            ? "سجل محادثات الشركة"
                            : "سجل محادثاتك"}
                    </p>
                </div>

                <Button
                    type="button"
                    variant="panel"
                    size="normal"
                    onClick={onCreateNew}
                    className="flex min-h-[42px] items-center justify-center rounded-[12px] bg-[#5f86dd] px-4! py-2! !text-sm font-bold text-white hover:brightness-105"
                >
                    <MessageSquarePlus className="ml-2 size-4" />
                    جديد
                </Button>
            </div>

            {conversations.length === 0 ? (
                <div className="rounded-[20px] border border-dashed border-[#d6dfef] bg-[#f9fbff] px-4 py-8 text-center">
                    <MessageSquare className="mx-auto mb-3 size-8 text-[#8ca2cf]" />
                    <p className="m-0 text-sm font-semibold text-[#40506e]">
                        لا توجد محادثات بعد
                    </p>
                    <p className="mt-2 text-[13px] leading-[1.8] text-[#73819b]">
                        ابدأ أول محادثة وسيظهر سجلها هنا تلقائيًا.
                    </p>
                </div>
            ) : (
                <div className="grid max-h-[520px] gap-3 overflow-y-auto pr-1">
                    {conversations.map((conversation) => (
                        <ConversationItem
                            key={conversation.id}
                            conversation={conversation}
                            isSelected={
                                selectedConversationId === conversation.id
                            }
                            onSelect={() =>
                                onSelectConversation(conversation.id)
                            }
                            onRenameConversation={onRenameConversation}
                            onDeleteConversation={onDeleteConversation}
                        />
                    ))}
                </div>
            )}
        </aside>
    )
}

interface ConversationItemProps {
    conversation: ConversationThread
    isSelected: boolean
    onSelect: () => void
    onRenameConversation: (id: string, title: string) => void
    onDeleteConversation: (id: string) => void
}

function ConversationItem({
    conversation,
    isSelected,
    onSelect,
    onRenameConversation,
    onDeleteConversation,
}: ConversationItemProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [titleDraft, setTitleDraft] = useState(conversation.title)

    const handleRenameSave = () => {
        const nextTitle = titleDraft.trim()

        if (!nextTitle) {
            setTitleDraft(conversation.title)
            setIsEditing(false)
            return
        }

        onRenameConversation(conversation.id, nextTitle)
        setIsEditing(false)
    }

    const handleDelete = () => {
        if (window.confirm("هل تريد حذف هذه المحادثة؟")) {
            onDeleteConversation(conversation.id)
        }
    }

    return (
        <div
            className={cn(
                "rounded-[20px] border px-4 py-3 transition duration-200",
                isSelected
                    ? "border-[#9cb5eb] bg-[#eef4ff]"
                    : "border-[#edf2fb] bg-[#fbfdff] hover:border-[#d6dfef]",
            )}
        >
            <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eff4ff] text-primary">
                    <MessageSquare className="size-4" />
                </span>

                <div className="min-w-0 flex-1 text-right">
                    {isEditing ? (
                        <div className="grid gap-2">
                            <input
                                value={titleDraft}
                                onChange={(event) =>
                                    setTitleDraft(event.target.value)
                                }
                                className="w-full rounded-[12px] border border-[#cad7ee] bg-white px-3 py-2 text-right text-sm text-black outline-none"
                                placeholder="عنوان المحادثة"
                            />

                            <div className="flex justify-start gap-2">
                                <Button
                                    type="button"
                                    variant="panel"
                                    size="normal"
                                    onClick={handleRenameSave}
                                    className="rounded-[10px] bg-[#5f86dd] px-3 py-1.5 !text-xs font-bold text-white"
                                >
                                    حفظ
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="normal"
                                    onClick={() => {
                                        setTitleDraft(conversation.title)
                                        setIsEditing(false)
                                    }}
                                    className="rounded-[10px] px-3 py-1.5 !text-xs font-bold"
                                >
                                    إلغاء
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={onSelect}
                            className="w-full cursor-pointer bg-transparent p-0 text-right"
                        >
                            <p className="m-0 truncate text-sm font-bold text-black">
                                {conversation.title}
                            </p>
                            <p className="mt-1 text-[12px] text-[#7c889e]">
                                {formatConversationDate(conversation.updatedAt)}
                            </p>
                        </button>
                    )}
                </div>

                {!isEditing ? (
                    <div className="flex shrink-0 items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-[#60708d] transition duration-200 hover:bg-[#e9effb] hover:text-primary"
                            aria-label="إعادة تسمية المحادثة"
                        >
                            <Pencil className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-[#8d6370] transition duration-200 hover:bg-[#fff2f2] hover:text-[#c43833]"
                            aria-label="حذف المحادثة"
                        >
                            <Trash2 className="size-4" />
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    )
}
