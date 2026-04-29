import type { PortalRole } from "../../../components/layout/PortalLayout"

export type ConversationActor = "user" | "assistant"

export interface ConversationMessage {
    id: string
    role: ConversationActor
    text: string
    createdAt: string
}

export interface ConversationThread {
    id: string
    title: string
    createdAt: string
    updatedAt: string
    messages: ConversationMessage[]
}

export interface ConversationSuggestion {
    id: string
    label: string
    prompt: string
}

export interface ConversationPreset {
    emptyStateTitle: string
    emptyStateDescription: string
    composerPlaceholder: string
    typingLabel: string
    suggestions: ConversationSuggestion[]
}

export type ConversationRole = PortalRole
