import {
    usePortalSavedTrainingsQuery,
    useRemovePortalSavedTraining,
    useSavePortalTraining,
} from "../../api/portalSaved"

export function usePortalSavedTrainings() {
    const savedTrainingsQuery = usePortalSavedTrainingsQuery()
    const saveTrainingMutation = useSavePortalTraining()
    const removeSavedTrainingMutation = useRemovePortalSavedTraining()
    const savedTrainings = savedTrainingsQuery.savedTrainings
    const savedTrainingsByTrainingId = new Map(
        savedTrainings.map((savedTraining) => [
            savedTraining.trainingId,
            savedTraining,
        ]),
    )

    function isSavedTraining(trainingId: string) {
        return savedTrainingsByTrainingId.has(trainingId)
    }

    async function toggleSavedTraining(trainingId: string, notes = "") {
        const savedTraining = savedTrainingsByTrainingId.get(trainingId)

        if (savedTraining) {
            await removeSavedTrainingMutation.mutateAsync(
                `/saved/trainings/${encodeURIComponent(savedTraining.savedId)}`,
            )
            return
        }

        await saveTrainingMutation.mutateAsync({
            trainingId,
            notes,
        })
    }

    return {
        savedTrainings,
        savedTrainingIds: savedTrainings.map(
            (savedTraining) => savedTraining.trainingId,
        ),
        hasSavedTrainings: savedTrainings.length > 0,
        isSavedTraining,
        toggleSavedTraining,
        isLoadingSavedTrainings: savedTrainingsQuery.isLoading,
        isFetchingSavedTrainings: savedTrainingsQuery.isFetching,
        isSavingTraining: saveTrainingMutation.isPending,
        isRemovingSavedTraining: removeSavedTrainingMutation.isPending,
        isSavedTrainingsActionPending:
            saveTrainingMutation.isPending ||
            removeSavedTrainingMutation.isPending,
    }
}
