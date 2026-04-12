import { useState } from "react"

const PORTAL_SAVED_JOB_IDS_STORAGE_KEY = "portal-saved-job-ids"

function normalizeSavedJobIds(value: unknown) {
    if (!Array.isArray(value)) {
        return []
    }

    return Array.from(
        new Set(value.filter((item): item is string => typeof item === "string")),
    )
}

function readSavedJobIds() {
    if (typeof window === "undefined") {
        return []
    }

    try {
        const rawValue = window.localStorage.getItem(
            PORTAL_SAVED_JOB_IDS_STORAGE_KEY,
        )

        if (!rawValue) {
            return []
        }

        return normalizeSavedJobIds(JSON.parse(rawValue))
    } catch {
        return []
    }
}

function writeSavedJobIds(savedJobIds: string[]) {
    if (typeof window === "undefined") {
        return
    }

    window.localStorage.setItem(
        PORTAL_SAVED_JOB_IDS_STORAGE_KEY,
        JSON.stringify(savedJobIds),
    )
}

export function usePortalSavedJobs() {
    const [savedJobIds, setSavedJobIds] = useState<string[]>(readSavedJobIds)

    function isSavedJob(jobId: string) {
        return savedJobIds.includes(jobId)
    }

    function toggleSavedJob(jobId: string) {
        setSavedJobIds((currentSavedJobIds) => {
            const nextSavedJobIds = currentSavedJobIds.includes(jobId)
                ? currentSavedJobIds.filter(
                      (savedJobId) => savedJobId !== jobId,
                  )
                : [...currentSavedJobIds, jobId]

            writeSavedJobIds(nextSavedJobIds)

            return nextSavedJobIds
        })
    }

    return {
        savedJobIds,
        hasSavedJobs: savedJobIds.length > 0,
        isSavedJob,
        toggleSavedJob,
    }
}
