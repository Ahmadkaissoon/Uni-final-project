import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../../utils/cn";

export const buttonVariants = cva(
  "inline-flex items-center !scale-100 justify-center whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 transition-all duration-[0.3s] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "font-medium !text-13p py-9p px-16p bg-primary text-primary-foreground hover:bg-primary-hover rounded-xs border border-solid border-primary hover:border-primary-hover",
        outline:
          "font-medium !text-13p py-9p px-16p bg-transparent text-primary-hover hover:text-primary-foreground hover:bg-primary-hover rounded-xs border border-solid border-primary-hover",
        link: "text-primary underline-offset-4 hover:underline",
        "table-filter":
          "!font-normal  items-center !text-sm bg-white border rounded-xs !h-8",
        panel:
          "font-medium !text-13p py-9p px-16p bg-top-panel-button text-top-panel-button-foreground hover:brightness-95 rounded-[7px]",
        "ghost-light":
          "font-medium !text-13p py-9p px-16p bg-transparent text-foreground-secondary hover:bg-background-hover rounded-xs",
        destructive:
          "font-medium !text-13p py-9p px-16p bg-destructive text-destructive-foreground hover:bg-destructive-hover rounded-xs border border-solid border-destructive hover:border-destructive-hover",
      },
      size: {
        default: "h-9 px-6 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-13 rounded-md px-8",
        icon: "h-9 w-9 flex justify-center items-center !p-0",
        "icon-circle":
          "h-[32px] w-[32px] flex justify-center items-center rounded-full !p-0",
        "panel-icon": "h-[36px] w-[36px] flex justifyContent interface !p-0",
        normal: "!p-0",
      },
      status: {
        default: "",
        active:
          "after:!border-primary hover:after:!after:border-primary text-foreground-light",
        "active-primary-tab": "text-primary",
        "active-radio": "!bg-primary !text-white",
        "active-remove-button": "!text-icon-grey",
        "active-remove-button-hover":
          "!text-icon-grey !text-icon-grey-hover bg-dropdown-hover",
        "active-primary": "!bg-primary/10 !text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      status: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  status?:
    | "default"
    | "active"
    | "active-radio"
    | "active-remove-button"
    | "active-remove-button-hover"
    | "active-primary"
    | "active-primary-tab";
}

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { loading?: boolean }
>(
  (
    {
      className,
      variant,
      size,
      status,
      loading,
      children,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, status, className }))}
        ref={ref}
        {...props}
        disabled={loading || props.disabled}
      >
        <>
          {loading ? <Loader2 className=" animate-spin me-1" /> : null}
          {children}
        </>
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button };
