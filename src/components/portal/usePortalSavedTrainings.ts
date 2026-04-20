import { useState } from "react"

const PORTAL_SAVED_TRAINING_IDS_STORAGE_KEY = "portal-saved-training-ids"

function normalizeSavedTrainingIds(value: unknown) {
    if (!Array.isArray(value)) {
        return []
    }

    return Array.from(
        new Set(value.filter((item): item is string => typeof item === "string")),
    )
}

function readSavedTrainingIds() {
    if (typeof window === "undefined") {
        return []
    }

    try {
        const rawValue = window.localStorage.getItem(
            PORTAL_SAVED_TRAINING_IDS_STORAGE_KEY,
        )

        if (!rawValue) {
            return []
        }

        return normalizeSavedTrainingIds(JSON.parse(rawValue))
    } catch {
        return []
    }
}

function writeSavedTrainingIds(savedTrainingIds: string[]) {
    if (typeof window === "undefined") {
        return
    }

    window.localStorage.setItem(
        PORTAL_SAVED_TRAINING_IDS_STORAGE_KEY,
        JSON.stringify(savedTrainingIds),
    )
}

export function usePortalSavedTrainings() {
    const [savedTrainingIds, setSavedTrainingIds] =
        useState<string[]>(readSavedTrainingIds)

    function isSavedTraining(trainingId: string) {
        return savedTrainingIds.includes(trainingId)
    }

    function toggleSavedTraining(trainingId: string) {
        setSavedTrainingIds((currentSavedTrainingIds) => {
            const nextSavedTrainingIds = currentSavedTrainingIds.includes(
                trainingId,
            )
                ? currentSavedTrainingIds.filter(
                      (savedTrainingId) => savedTrainingId !== trainingId,
                  )
                : [...currentSavedTrainingIds, trainingId]

            writeSavedTrainingIds(nextSavedTrainingIds)

            return nextSavedTrainingIds
        })
    }

    return {
        savedTrainingIds,
        hasSavedTrainings: savedTrainingIds.length > 0,
        isSavedTraining,
        toggleSavedTraining,
    }
}
