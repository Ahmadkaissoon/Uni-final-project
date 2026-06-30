import { usePortalTrainings } from "../../api/portalTrainings"
import PortalAllInternshipsSection from "../../components/portal/PortalAllInternshipsSection"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalInternshipsPageProps {
    page: PortalPageDefinition
}

export default function PortalInternshipsPage({
    page,
}: PortalInternshipsPageProps) {
    const trainingsQuery = usePortalTrainings()

    return (
        <PortalAllInternshipsSection
            title={page.title}
            description={page.description}
            internships={trainingsQuery.trainings}
            isLoading={trainingsQuery.isLoading}
            emptyText={
                trainingsQuery.isError
                    ? "تعذر تحميل التدريبات حالياً، يرجى المحاولة لاحقاً."
                    : "لا توجد تدريبات متاحة حالياً."
            }
        />
    )
}
