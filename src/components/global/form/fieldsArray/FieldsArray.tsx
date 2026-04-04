import type { ReactNode } from "react";
import { Button } from "../button/Button";
import { FaPlus, FaXmark } from "react-icons/fa6";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../tooltip/Tooltiop";

/**
 * Props for FieldsArrayContainer component
 */
interface FieldsArrayContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Main container for a fields array (table-like structure)
 * Wraps all the array fields and provides consistent styling
 */
export default function FieldsArrayContainer({
  children,
}: FieldsArrayContainerProps) {
  return (
    <div className="w-full flex flex-col min-w-[500px] border border-quaternary-border rounded-[8px]">
      {children}
    </div>
  );
}

/**
 * Props for FieldsArrayHeaderContainer component
 */
interface FieldsArrayHeaderContainerProps {
  children?: ReactNode;
  className?: string;
  titles?: { name: string; className?: string }[]; // Array of column titles with optional className
}

/**
 * Header container for the fields array
 * Displays column titles and provides consistent header styling
 */
export function FieldsArrayHeaderContainer({
  children,
  className = "",
  titles,
}: FieldsArrayHeaderContainerProps) {
  return (
    <div
      className={`grid grid-cols-7 bg-primary-bg border-b rounded-t-[8px] border-quaternary-border ${className}`}
    >
      {titles?.map((item, index) => {
        return (
          <FieldsArrayHeaderCell key={index} className={item?.className}>
            {item?.name}
          </FieldsArrayHeaderCell>
        );
      })}
      {children}
    </div>
  );
}

/**
 * Props for FieldsArrayHeaderCell component
 */
interface FieldsArrayHeaderCellProps {
  children: ReactNode;
  className?: string;
}

/**
 * Individual header cell for the fields array
 * Provides consistent styling for header cells
 */
export function FieldsArrayHeaderCell({
  children,
  className = "",
}: FieldsArrayHeaderCellProps) {
  return (
    <div
      className={`p-[16px] first:rounded-tr-[8px] last:rounded-tl-[8px] flex items-center justify-center text-[26px] text-primary-foreground font-bold border-e border-quaternary-border last:border-e-0 col-span-2 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Props for FieldsArrayRowContainer component
 */
interface FieldsArrayRowContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Container for a single row in the fields array
 * Provides consistent row styling and layout
 */
export function FieldsArrayRowContainer({
  children,
  className = "",
}: FieldsArrayRowContainerProps) {
  return (
    <div
      className={`grid grid-cols-7 last:rounded-b-[8px] bg-tertiary-bg border-b border-quaternary-border last:border-b-0 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Props for FieldsArrayRowCell component
 */
interface FieldsArrayRowCellProps {
  children: ReactNode;
  className?: string;
}

/**
 * Individual cell within a fields array row
 * Provides consistent styling for data cells
 */
export function FieldsArrayRowCell({
  children,
  className = "",
}: FieldsArrayRowCellProps) {
  return (
    <div
      className={`px-[16px] py-[7px] flex items-center justify-center text-[26px] text-primary-foreground font-bold border-e border-quaternary-border last:border-e-0 col-span-2 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Props for FieldsArrayRemoveButton component
 */
interface FieldsArrayRemoveButtonProps {
  className?: string;
  remove: (id: number) => void; // Function to remove the row at the specified index
  index: number; // Index of the row to be removed
}

/**
 * Button for removing a row from the fields array
 * Includes a tooltip and confirmation styling
 */
export function FieldsArrayRemoveButton({
  className,
  remove,
  index,
}: FieldsArrayRemoveButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant={"semi-round"}
          size={"icon"}
          className={`bg-error ${className}`}
          onClick={(e) => {
            e.preventDefault();
            remove(index);
          }}
        >
          <FaXmark />
        </Button>
      </TooltipTrigger>
      <TooltipContent>حذف</TooltipContent>
    </Tooltip>
  );
}

/**
 * Props for FieldsArrayAddButton component
 * @template T - Type of the initial values for a new row
 */
interface FieldsArrayAddButtonProps<T> {
  className?: string;
  append: (row: T) => void; // Function to append a new row
  initialValues: T; // Default values for a new row
}

/**
 * Button for adding a new row to the fields array
 * Appends a row with the provided initial values
 */
export function FieldsArrayAddButton<T>({
  className,
  append,
  initialValues,
}: FieldsArrayAddButtonProps<T>) {
  return (
    <Button
      variant={"outline"}
      className={`self-start px-[20px] ${className}`}
      onClick={(e) => {
        e.preventDefault();
        append(initialValues);
      }}
    >
      <span>إضافة</span>
      <FaPlus />
    </Button>
  );
}
