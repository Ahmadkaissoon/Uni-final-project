import { useSearchParams } from "react-router-dom"

import PortalAllJobsSection from "../../components/portal/PortalAllJobsSection"
import PortalJobDetailsSection from "../../components/portal/PortalJobDetailsSection"
import { normalizePortalCompanyValue } from "../../components/portal/portalCompaniesData"
import { portalJobRecords } from "../../components/portal/portalJobsData"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalAllJobsPageProps {
    page: PortalPageDefinition
}

export default function PortalAllJobsPage({ page }: PortalAllJobsPageProps) {
    const [searchParams] = useSearchParams()
    const selectedJobId = searchParams.get("job")
    const selectedCompanyId = searchParams.get("company")
    const selectedJob = selectedJobId
        ? portalJobRecords.find((job) => job.id === selectedJobId)
        : null
    const filteredJobs = selectedCompanyId
        ? portalJobRecords.filter((job) => {
              const normalizedCompanyWebsite = normalizePortalCompanyValue(
                  job.companyWebsite,
              )
              const normalizedCompanyName = normalizePortalCompanyValue(
                  job.companyName,
              )

              return (
                  normalizedCompanyWebsite === selectedCompanyId ||
                  normalizedCompanyName === selectedCompanyId
              )
          })
        : portalJobRecords
    const selectedCompanyName = filteredJobs[0]?.companyName ?? null

    if (selectedJob) {
        return (
            <PortalJobDetailsSection
                title={page.title}
                // description={page.description}
                job={selectedJob}
            />
        )
    }

    return (
        <PortalAllJobsSection
            title={selectedCompanyName ? `وظائف ${selectedCompanyName}` : page.title}
            description={
                selectedCompanyName
                    ? `استعرض الوظائف المتاحة حاليًا لدى ${selectedCompanyName}.`
                    : page.description
            }
            jobs={filteredJobs}
        />
    )
}
