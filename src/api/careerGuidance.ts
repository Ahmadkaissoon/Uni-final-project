import { useMemo } from "react"

import { queryClient } from "./queryClient"
import { useDeleteData, useGetData, usePostData } from "./useQueries"

interface ApiCareerGuidanceConversation {
    id?: string
    _id?: string
    title?: string | null
    createdAt?: string | null
    updatedAt?: string | null
    messageCount?: number | string | null
}

export interface CareerGuidanceConversationSummary {
    id: string
    title: string
    createdAt: string
    updatedAt: string
    messageCount: number
}

export interface CareerGuidanceAskPayload {
    question: string
    conversationId?: string
}

interface ApiCareerGuidanceAskResponse {
    conversationId?: string
    title?: string | null
    answer?: string | null
}

export interface CareerGuidanceAskResponse {
    conversationId: string
    title: string
    answer: string
}

interface ApiCareerGuidanceCreateConversationResponse {
    id?: string
    _id?: string
    title?: string | null
    createdAt?: string | null
    updatedAt?: string | null
    messageCount?: number | string | null
}

interface ApiCareerGuidanceConversationMessage {
    _id?: string
    id?: string
    role?: string | null
    content?: string | null
    createdAt?: string | null
}

interface ApiCareerGuidanceConversationDetails {
    id?: string
    _id?: string
    title?: string | null
    messages?: ApiCareerGuidanceConversationMessage[] | null
}

interface ApiCareerGuidanceDeleteConversationResponse {
    success?: boolean
    message?: string
    conversationId?: string
}

interface ApiCareerGuidanceProfileAdviceResponse {
    advice?: string | null
}

export interface CareerGuidanceConversationMessage {
    id: string
    role: "user" | "assistant"
    text: string
    createdAt: string
}

export interface CareerGuidanceConversationDetails {
    id: string
    title: string
    messages: CareerGuidanceConversationMessage[]
}

function formatValue(value: unknown, fallback = "") {
    if (value === null || value === undefined) {
        return fallback
    }

    const text = String(value).trim()
    return text || fallback
}

function resolveMessageCount(value: unknown) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value
    }

    const parsedValue = Number(formatValue(value))
    return Number.isFinite(parsedValue) ? parsedValue : 0
}

function mapCareerGuidanceConversation(
    conversation: ApiCareerGuidanceConversation,
): CareerGuidanceConversationSummary {
    const id = formatValue(conversation.id ?? conversation._id)

    return {
        id,
        title: formatValue(conversation.title, "محادثة بدون عنوان"),
        createdAt: formatValue(conversation.createdAt),
        updatedAt: formatValue(conversation.updatedAt),
        messageCount: resolveMessageCount(conversation.messageCount),
    }
}

function mapCareerGuidanceAskResponse(
    response: ApiCareerGuidanceAskResponse,
): CareerGuidanceAskResponse {
    return {
        conversationId: formatValue(response.conversationId),
        title: formatValue(response.title, "محادثة جديدة"),
        answer: formatValue(response.answer),
    }
}

function mapCareerGuidanceMessage(
    message: ApiCareerGuidanceConversationMessage,
    index: number,
): CareerGuidanceConversationMessage {
    const role = formatValue(message.role).toLowerCase()

    return {
        id: formatValue(message.id ?? message._id, `message-${index}`),
        role: role === "user" ? "user" : "assistant",
        text: formatValue(message.content),
        createdAt: formatValue(message.createdAt),
    }
}

function mapCareerGuidanceConversationDetails(
    conversation: ApiCareerGuidanceConversationDetails,
): CareerGuidanceConversationDetails {
    return {
        id: formatValue(conversation.id ?? conversation._id),
        title: formatValue(conversation.title, "محادثة بدون عنوان"),
        messages:
            conversation.messages?.map(mapCareerGuidanceMessage) ?? [],
    }
}

export function useCareerGuidanceConversations(enabled = true) {
    const query = useGetData<ApiCareerGuidanceConversation[]>(
        "/career-guidance/conversations",
        {},
        {
            enabled,
            queryKey: ["career-guidance-conversations"],
        },
    )
    const conversations = useMemo(
        () =>
            query.data
                ?.map(mapCareerGuidanceConversation)
                .filter((conversation) => conversation.id) ?? [],
        [query.data],
    )

    return {
        ...query,
        conversations,
    }
}

export function useCareerGuidanceConversationDetails(
    conversationId: string | null,
    enabled = true,
) {
    const query = useGetData<ApiCareerGuidanceConversationDetails>(
        conversationId
            ? `/career-guidance/conversations/${encodeURIComponent(
                  conversationId,
              )}`
            : null,
        {},
        {
            enabled: enabled && Boolean(conversationId),
            queryKey: ["career-guidance-conversation", conversationId],
        },
    )
    const conversation = useMemo(
        () =>
            query.data
                ? mapCareerGuidanceConversationDetails(query.data)
                : null,
        [query.data],
    )

    return {
        ...query,
        conversation,
    }
}

export function useAskCareerGuidance() {
    const mutation = usePostData<
        ApiCareerGuidanceAskResponse,
        CareerGuidanceAskPayload
    >(
        "/career-guidance/ask",
        {},
        {
            toastMessages: null,
        },
    )

    return {
        ...mutation,
        askAsync: async (payload: CareerGuidanceAskPayload) =>
            mapCareerGuidanceAskResponse(await mutation.mutateAsync(payload)),
    }
}

export function useCreateCareerGuidanceConversation() {
    const mutation = usePostData<
        ApiCareerGuidanceCreateConversationResponse,
        Record<string, never>
    >(
        "/career-guidance/conversations",
        {},
        {
            toastMessages: null,
        },
    )

    return {
        ...mutation,
        createConversationAsync: async () =>
            mapCareerGuidanceConversation(await mutation.mutateAsync({})),
    }
}

export function useDeleteCareerGuidanceConversation() {
    const mutation = useDeleteData<ApiCareerGuidanceDeleteConversationResponse>(
        {},
        {
            toastMessages: {
                loading: "جارٍ حذف المحادثة...",
                success: "تم حذف المحادثة بنجاح",
                error: "فشل حذف المحادثة",
            },
            onSuccess: (data) => {
                void queryClient.invalidateQueries({
                    queryKey: ["career-guidance-conversations"],
                })

                const deletedConversationId = formatValue(data.conversationId)

                if (deletedConversationId) {
                    void queryClient.removeQueries({
                        queryKey: [
                            "career-guidance-conversation",
                            deletedConversationId,
                        ],
                    })
                }
            },
        },
    )

    return {
        ...mutation,
        deleteConversationAsync: (conversationId: string) =>
            mutation.mutateAsync(
                `/career-guidance/conversations/${encodeURIComponent(
                    conversationId,
                )}`,
            ),
    }
}

export function useCareerGuidanceProfileAdvice() {
    const mutation = usePostData<
        ApiCareerGuidanceProfileAdviceResponse,
        Record<string, never>
    >(
        "/career-guidance/advice",
        {},
        {
            toastMessages: null,
        },
    )

    return {
        ...mutation,
        getAdviceAsync: async () => {
            const response = await mutation.mutateAsync({})
            return formatValue(response.advice)
        },
    }
}
