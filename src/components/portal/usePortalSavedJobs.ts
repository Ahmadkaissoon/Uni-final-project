import {
    usePortalSavedJobsQuery,
    useRemovePortalSavedJob,
    useSavePortalJob,
} from "../../api/portalSaved"

export function usePortalSavedJobs() {
    const savedJobsQuery = usePortalSavedJobsQuery()
    const saveJobMutation = useSavePortalJob()
    const removeSavedJobMutation = useRemovePortalSavedJob()
    const savedJobs = savedJobsQuery.savedJobs
    const savedJobsByJobId = new Map(
        savedJobs.map((savedJob) => [savedJob.jobId, savedJob]),
    )

    function isSavedJob(jobId: string) {
        return savedJobsByJobId.has(jobId)
    }

    async function toggleSavedJob(jobId: string, notes = "") {
        const savedJob = savedJobsByJobId.get(jobId)

        if (savedJob) {
            await removeSavedJobMutation.mutateAsync(
                `/saved/jobs/${encodeURIComponent(savedJob.savedId)}`,
            )
            return
        }

        await saveJobMutation.mutateAsync({
            jobId,
            notes,
        })
    }

    return {
        savedJobs,
        savedJobIds: savedJobs.map((savedJob) => savedJob.jobId),
        hasSavedJobs: savedJobs.length > 0,
        isSavedJob,
        toggleSavedJob,
        isLoadingSavedJobs: savedJobsQuery.isLoading,
        isFetchingSavedJobs: savedJobsQuery.isFetching,
        isSavingJob: saveJobMutation.isPending,
        isRemovingSavedJob: removeSavedJobMutation.isPending,
        isSavedJobsActionPending:
            saveJobMutation.isPending || removeSavedJobMutation.isPending,
    }
}
