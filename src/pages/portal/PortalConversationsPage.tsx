import type { PortalPageDefinition } from "../../router/portalPages"
import Conversations from "../global/conversations/Conversations"

interface PortalConversationsPageProps {
    page: PortalPageDefinition
}

export default function PortalConversationsPage({
    page,
}: PortalConversationsPageProps) {
    return (
        <Conversations
            key={page.id}
            role={page.role}
            title={page.title}
            description={page.description}
        />
    )
}
