import type { ReactNode } from "react"

export interface ReusableTableColumn {
    id: string
    header: ReactNode
    value?: string
    cell?: (row: any) => ReactNode
    className?: string
    sortable?: boolean
    sortFn?: (a: any, b: any, direction: "asc" | "desc") => number
}

export interface ReusableTableAction {
    title?: ReactNode
    onClickFun?: (row: any) => void
    color?: string
}

export interface ReusableTableProps {
    data?: any[]
    columns?: ReusableTableColumn[]
    actions?: ReusableTableAction[]
    alternateRowColors?: boolean
    rowBackgrounds?: string[]
    primaryColor?: string
    secondaryColor?: string
    textColor?: string
    bodyTextColor?: string
    dir?: string
    showRowNumbers?: boolean
    isLoading?: boolean
    loadingText?: string
    emptyText?: string
}

declare function ReusableTable(props: ReusableTableProps): ReactNode

export default ReusableTable
