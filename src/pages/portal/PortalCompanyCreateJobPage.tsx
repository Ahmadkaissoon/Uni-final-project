import { PencilLine } from "lucide-react"
import { useState } from "react"

import PortalCompanyJobForm from "../../components/portal/PortalCompanyJobForm"
import PortalJobDetailsSection from "../../components/portal/PortalJobDetailsSection"
import {
    buildCompanyJobRecord,
    emptyCompanyJobFormData,
    type CompanyJobFormData,
} from "../../components/portal/companyForms/companyJobFormModel"
import type { PortalJobRecord } from "../../components/portal/portalJobsData"
import { Button } from "../../components/global/ui/button"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalCompanyCreateJobPageProps {
    page: PortalPageDefinition
}

export default function PortalCompanyCreateJobPage({
    page: _page,
}: PortalCompanyCreateJobPageProps) {
    const [previewJob, setPreviewJob] = useState<PortalJobRecord | null>(null)

    function handleSubmit(formData: CompanyJobFormData) {
        setPreviewJob(buildCompanyJobRecord(formData))
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    if (previewJob) {
        return (
            <section className="pb-12 pt-10 sm:pb-18 sm:pt-12" dir="rtl">
                <div className="portal-design-shell">
                    <div className="portal-design-inset">
                        <div className="portal-category-card-shadow rounded-[24px] border border-[#e4edf8] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 text-right sm:p-7">
                            <h1 className="m-0 text-[28px] font-bold leading-[1.35] text-[#233047] sm:text-[34px]">
                                تمت معاينة الوظيفة بنجاح
                            </h1>
                            <p className="mt-3 mb-0 max-w-[42ch] text-size18 font-medium leading-[1.9] text-[#495567]">
                                هكذا ستظهر الوظيفة بعد إضافتها على المنصة. يمكنك
                                الرجوع لتعديل البيانات أو البدء بإدخال وظيفة جديدة.
                            </p>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    variant="panel"
                                    size="normal"
                                    onClick={() => setPreviewJob(null)}
                                    className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-[10px] border border-[var(--main-color)] bg-white !px-5 !py-3 !text-size16 !font-bold !text-[var(--main-color)] hover:!bg-[#f5f9ff]"
                                >
                                    <PencilLine className="ml-3 size-5" />
                                    العودة للتعديل
                                </Button>

                                <Button
                                    type="button"
                                    variant="panel"
                                    size="normal"
                                    onClick={() => setPreviewJob(null)}
                                    className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-[10px] border border-[#d7e3f5] bg-[#f8fbff] !px-5 !py-3 !text-size16 !font-bold !text-[#1f355d] hover:!bg-[#eef5ff]"
                                >
                                    إنشاء وظيفة جديدة
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <PortalJobDetailsSection
                    title="تفاصيل الوظيفة"
                    description="هكذا ستظهر الوظيفة بعد نشرها على منصة وظيفتي."
                    job={previewJob}
                    showActions={false}
                />
            </section>
        )
    }

    return (
        <PortalCompanyJobForm
            initialValues={emptyCompanyJobFormData}
            resetValues={emptyCompanyJobFormData}
            onSubmit={handleSubmit}
        />
    )
}
