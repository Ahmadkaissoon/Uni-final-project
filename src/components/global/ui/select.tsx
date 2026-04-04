import * as React from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/utils/cn";
import { X } from "lucide-react";
import type { IconType } from "react-icons/lib";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  Icon?: IconType;
  variant?: "white" | "default" | "contract";
  hasError?: boolean;
  clear?: () => void;
  currentValue: string | undefined | null | number | boolean;
  removable?: boolean;
  customTriggerValue?: boolean;
}
const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(
  (
    {
      className,
      children,
      Icon,
      variant,
      hasError,
      currentValue,
      clear,
      removable,
      customTriggerValue,
      ...props
    },
    ref
  ) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        variant == "white"
          ? "group flex justify-between h-[34px] w-full rounded-[5px] text-input-foreground bg-card py-[6px] ps-[12px] pe-[33px] border border-solid border-input text-13p font-medium placeholder:text-placeholder-secondary outline-none disabled:cursor-not-allowed disabled:opacity-70 transition-all duration-[0.2s]"
          : "group flex justify-between h-[39px] w-full rounded-[5px] text-input-foreground bg-input-background py-[9.5px] px-[14px] border border-solid border-input-background text-13p font-medium placeholder:text-placeholder-secondary outline-none focus:border-input-border-focus focus:bg-input-background-focus aria-expanded:border-input-border-focus aria-expanded:bg-input-background-focus disabled:cursor-not-allowed disabled:bg-input-background-disabled disabled:text-input-placeholder transition-all duration-[0.2s]",
        "truncate",
        className,
        !!Icon && "ps-9",
        hasError && "border-destructive focus-visible:border-destructive",
        !currentValue && "!text-input-placeholder"
      )}
      {...props}
    >
      {children}
      {/* Clear button (only shows when a value is selected) */}
      {currentValue && removable && !customTriggerValue && (
        <SelectPrimitive.Icon asChild onClick={clear} className="ms-auto me-2">
          <X className="h-4 w-4 opacity-50 hover:opacity-80 transition-all duration-[0.2s]" />
        </SelectPrimitive.Icon>
      )}
      {customTriggerValue ? null : (
        <SelectPrimitive.Icon
          asChild
          className={`${currentValue && removable ? "me-0" : "ms-auto"}`}
        >
          <ChevronDownIcon className="h-4 w-4 opacity-50 rotate-0 group-aria-expanded:rotate-180 transition-all duration-[0.2s]" />
        </SelectPrimitive.Icon>
      )}
    </SelectPrimitive.Trigger>
  )
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUpIcon />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDownIcon />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-[41] max-h-96 min-w-[8rem] overflow-hidden rounded-b-[5px] shadow-drop data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          " data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 ",
        className
      )}
      position={position}
      {...props}
    >
      {/* <SelectScrollUpButton /> */}
      <SelectPrimitive.Viewport
        className={cn(
          "",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      {/* <SelectScrollDownButton /> */}
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative cursor-pointer flex w-full select-none bg-tertiary-bg items-center py-[12px] px-[11px] !text-13p outline-none focus:bg-select-background-hover text-foreground-light data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute end-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
