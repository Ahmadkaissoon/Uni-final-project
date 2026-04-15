import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import { Button } from "../ui/button";
import { cn } from "../../../utils/cn";

function resolveActionClassName(color) {
  const normalizedColor = `${color ?? ""}`.toLowerCase();

  if (
    normalizedColor.includes("red") ||
    normalizedColor.includes("danger") ||
    normalizedColor.includes("error")
  ) {
    return "border-[#b43531] bg-[#c63a35] !text-white hover:!brightness-105";
  }

  if (
    normalizedColor.includes("green") ||
    normalizedColor.includes("success") ||
    normalizedColor.includes("accept")
  ) {
    return "border-[#4ea56e] bg-[#5ab37b] !text-white hover:!brightness-105";
  }

  if (
    normalizedColor.includes("orange") ||
    normalizedColor.includes("warning") ||
    normalizedColor.includes("yellow")
  ) {
    return "border-warning-color bg-warning-color !text-white hover:!brightness-105";
  }

  return "border-[var(--main-color)] bg-[var(--main-color)] !text-white hover:!brightness-105";
}

const ReusableTable = ({
  data,
  columns,
  actions,
  alternateRowColors = true,
  rowBackgrounds,
  primaryColor = "var(--main-color)",
  secondaryColor = "#f7fbff",
  textColor = "var(--primary-foreground)",
  bodyTextColor = "var(--black)",
  dir = "rtl",
  showRowNumbers = true,
  isLoading = false,
  loadingText = "جاري تحميل البيانات...",
  emptyText = "لا يوجد بيانات للعرض",
}) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const safeData = Array.isArray(data) ? data : [];
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeActions = Array.isArray(actions) ? actions : [];

  const handleSort = (columnId) => {
    if (sortColumn === columnId) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortColumn(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    return [...safeData].sort((a, b) => {
      if (!sortColumn || !sortDirection || sortColumn === "rowNumber") {
        return 0;
      }

      const column = safeColumns.find((col) => col.id === sortColumn);
      if (!column) {
        return 0;
      }

      if (column.sortFn) {
        return column.sortFn(a, b, sortDirection);
      }

      if (!column.value) {
        return 0;
      }

      const aValue = a?.[column.value];
      const bValue = b?.[column.value];

      if (aValue == null && bValue == null) {
        return 0;
      }

      if (aValue == null) {
        return sortDirection === "asc" ? 1 : -1;
      }

      if (bValue == null) {
        return sortDirection === "asc" ? -1 : 1;
      }

      if (aValue === bValue) {
        return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue, "ar")
          : bValue.localeCompare(aValue, "ar");
      }

      return sortDirection === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
          ? 1
          : -1;
    });
  }, [safeColumns, safeData, sortColumn, sortDirection]);

  const renderSortIcon = (columnId) => {
    const iconClassName = "inline-block h-4 w-4";

    if (sortColumn !== columnId) {
      return <ArrowUpDown className={iconClassName} />;
    }

    return sortDirection === "asc" ? (
      <ArrowUp className={iconClassName} />
    ) : (
      <ArrowDown className={iconClassName} />
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[220px] w-full items-center justify-center rounded-[22px] border border-[#dbe5f3] bg-white p-8 text-center shadow-[0_16px_42px_rgba(14,35,59,0.08)]">
        <div className="text-size18 font-medium text-[#6a7788]">
          {loadingText}
        </div>
      </div>
    );
  }

  if (safeData.length === 0) {
    return (
      <div className="flex min-h-[220px] w-full items-center justify-center rounded-[22px] border border-dashed border-[#cfdced] bg-[#f9fbff] p-8 text-center shadow-[0_16px_42px_rgba(14,35,59,0.04)]">
        <div className="text-size18 font-medium text-[#6a7788]">
          {emptyText}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-[22px] border border-[#dbe5f3] bg-white shadow-[0_18px_46px_rgba(14,35,59,0.09)]">
      <Table dir={dir} className="min-w-full text-center">
        <TableHeader style={{ backgroundColor: primaryColor, color: textColor }}>
          <TableRow className="border-b-0 hover:!bg-transparent">
            {showRowNumbers && (
              <TableHead
                className="h-[64px] px-4 text-center text-size18 font-bold"
                style={{ color: textColor }}
              >
                #
              </TableHead>
            )}

            {safeColumns.map((column) => (
              <TableHead
                key={column.id}
                className={cn(
                  "h-[64px] px-4 text-center text-size18 font-bold",
                  column.className || "",
                )}
                style={{ color: textColor }}
              >
                <div className="inline-flex items-center justify-center gap-2">
                  <span>{column.header}</span>

                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(column.id)}
                      className="inline-flex items-center justify-center rounded-full p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
                      aria-label={`Sort by ${column.header}`}
                    >
                      {renderSortIcon(column.id)}
                    </button>
                  ) : null}
                </div>
              </TableHead>
            ))}

            {safeActions.length > 0 && (
              <TableHead
                className="h-[64px] px-4 text-center text-size18 font-bold"
                style={{ color: textColor }}
              >
                العمليات
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedData.map((row, index) => (
            <TableRow
              key={row?.id ?? index}
              className={cn(
                "border-b border-[#e6edf7] transition-colors",
                Array.isArray(rowBackgrounds) && rowBackgrounds.length > 0
                  ? "hover:brightness-[1.03]"
                  : "hover:!bg-[#edf4ff]",
              )}
              style={{
                backgroundColor:
                  Array.isArray(rowBackgrounds) && rowBackgrounds.length > 0
                    ? rowBackgrounds[index % rowBackgrounds.length]
                    : alternateRowColors
                      ? index % 2 === 0
                        ? "#ffffff"
                        : secondaryColor
                      : "#ffffff",
              }}
            >
              {showRowNumbers && (
                <TableCell
                  className="px-4 py-4 text-center text-size16 font-semibold"
                  style={{ color: bodyTextColor }}
                >
                  {index + 1}
                </TableCell>
              )}

              {safeColumns.map((column) => (
                <TableCell
                  key={column.id}
                  className={cn(
                    "px-4 py-4 text-center text-size16 font-medium",
                    column.className || "",
                  )}
                  style={{ color: bodyTextColor }}
                >
                  {column.cell
                    ? column.cell(row)
                    : column.value
                      ? row?.[column.value]
                      : null}
                </TableCell>
              ))}

              {safeActions.length > 0 && (
                <TableCell className="px-4 py-4 text-center">
                  <div className="flex flex-wrap justify-center gap-2">
                    {safeActions.map((action, actionIndex) => (
                      <Button
                        key={`${action.title ?? "action"}-${actionIndex + 1}`}
                        type="button"
                        variant="panel"
                        size="normal"
                        onClick={() => action.onClickFun?.(row)}
                        className={cn(
                          "inline-flex min-h-[38px] items-center justify-center rounded-[8px] border !px-3.5 !py-2 !text-size14 !font-bold shadow-none",
                          resolveActionClassName(action?.color),
                        )}
                      >
                        {action.title}
                      </Button>
                    ))}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReusableTable;
