import { PencilLine } from "lucide-react"
import { useState } from "react"

import { Button } from "../../components/global/ui/button"
import PortalCompanyTrainingForm from "../../components/portal/PortalCompanyTrainingForm"
import PortalTrainingDetailsSection from "../../components/portal/PortalTrainingDetailsSection"
import {
    buildCompanyTrainingRecord,
    emptyCompanyTrainingFormData,
    type CompanyTrainingFormData,
} from "../../components/portal/companyForms/companyTrainingFormModel"
import type { PortalTrainingRecord } from "../../components/portal/portalTrainingsData"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalCompanyCreateTrainingPageProps {
    page: PortalPageDefinition
}

export default function PortalCompanyCreateTrainingPage({
    page: _page,
}: PortalCompanyCreateTrainingPageProps) {
    const [previewTraining, setPreviewTraining] =
        useState<PortalTrainingRecord | null>(null)

    function handleSubmit(formData: CompanyTrainingFormData) {
        setPreviewTraining(buildCompanyTrainingRecord(formData))
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    if (previewTraining) {
        return (
            <section className="pb-12 pt-10 sm:pb-18 sm:pt-12" dir="rtl">
                <div className="portal-design-shell">
                    <div className="portal-design-inset">
                        <div className="portal-category-card-shadow rounded-[24px] border border-[#e4edf8] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 text-right sm:p-7">
                            <h1 className="m-0 text-[28px] font-bold leading-[1.35] text-[#233047] sm:text-[34px]">
                                تمت معاينة التدريب بنجاح
                            </h1>
                            <p className="mt-3 mb-0 max-w-[42ch] text-size18 font-medium leading-[1.9] text-[#495567]">
                                هكذا سيظهر التدريب بعد إضافته على المنصة. يمكنك
                                الرجوع لتعديل البيانات أو البدء بإدخال تدريب جديد.
                            </p>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    variant="panel"
                                    size="normal"
                                    onClick={() => setPreviewTraining(null)}
                                    className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-[10px] border border-[var(--main-color)] bg-white !px-5 !py-3 !text-size16 !font-bold !text-[var(--main-color)] hover:!bg-[#f5f9ff]"
                                >
                                    <PencilLine className="ml-3 size-5" />
                                    العودة للتعديل
                                </Button>

                                <Button
                                    type="button"
                                    variant="panel"
                                    size="normal"
                                    onClick={() => setPreviewTraining(null)}
                                    className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-[10px] border border-[#d7e3f5] bg-[#f8fbff] !px-5 !py-3 !text-size16 !font-bold !text-[#1f355d] hover:!bg-[#eef5ff]"
                                >
                                    إنشاء تدريب جديد
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <PortalTrainingDetailsSection
                    title="تفاصيل التدريب"
                    description="هكذا سيظهر التدريب بعد نشره على منصة وظيفتي."
                    training={previewTraining}
                />
            </section>
        )
    }

    return (
        <PortalCompanyTrainingForm
            initialValues={emptyCompanyTrainingFormData}
            resetValues={emptyCompanyTrainingFormData}
            onSubmit={handleSubmit}
        />
    )
}
