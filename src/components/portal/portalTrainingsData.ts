export interface PortalTrainingDetailEntry {
    id: string
    label: string
    value: string
}

export interface PortalTrainingRecord {
    id: string
    companyName: string
    trainingTitle: string
    trainingCategory: string
    companyLegalName: string
    companyWebsite: string
    imageSrc: string
    imageAlt: string
    detailColumns: PortalTrainingDetailEntry[][]
}
