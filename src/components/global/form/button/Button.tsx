import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../../utils/cn";

export const buttonVariants = cva(
  "inline-flex items-center gap-[10px] hover:brightness-[115%] justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer disabled:!cursor-not-allowed transition-all duration-[0.3s]",
  {
    variants: {
      variant: {
        default:
          "h-5xl gap-2xl py-md px-lg rounded !text-inverse-fg bg-primary text-size18",
        "semi-round":
          "!h-[40px] py-md px-lg rounded-2xl !text-inverse-fg bg-primary text-size16",
        "semi-round-outline":
          "!h-[40px] py-md px-lg hover:!bg-primary hover:!text-inverse-fg border-2 border-primary rounded-2xl !text-primary bg-transparent text-size16",
        destructive:
          "font-medium !text-13p py-9p px-16p bg-destructive text-destructive-foreground hover:bg-destructive-hover rounded-xs border border-solid border-destructive hover:border-destructive-hover",
        outline:
          "h-5xl border-[3px] border-primary rounded px-sm !text-primary hover:!text-inverse-fg hover:!bg-primary bg-transparent text-size18",
        secondary:
          "font-medium !text-13p py-9p px-16p bg-secondary text-secondary-foreground hover:bg-secondary-hover rounded-xs border border-solid border-secondary hover:border-secondary-hover",
        ghost:
          "font-medium !text-13p py-9p px-16p bg-transparent text-accent-hover hover:text-white hover:bg-accent-hover rounded-xs border border-solid border-transparent hover:border-accent-hover",
        link: "font-medium !text-size13 py-[9px] px-[16px] bg-transparent text-primary hover:bg-transparent rounded-xs border border-solid border-transparent hover:border-transparent",

        "ghost-light":
          "font-medium !text-13p py-9p px-16p bg-transparent text-foreground-secondary hover:bg-background-hover rounded-xs",
        panel:
          "font-medium !text-13p py-md px-lg bg-primary-bg text-primary-fg hover:brightness-95 rounded-[7px]",
        radio:
          "w-[180px] h-[40px] rounded-full py-[13px] px-[30px] bg-quinary-bg text-inverse-fg",
        "table-filter":
          "min-w-10xl text-size16 h-full px-sm py-xxs bg-transparent text-primary font-normal cursor-pointer rounded-sm group relative border-2 border-primary",
        pagination:
          "font-medium !text-size13 h-[40px] py-[9px] px-[16px] bg-transparent text-primary hover:text-primary-fg rounded-[7px] border border-solid border-primary ",
        "pagination-current":
          "font-medium !text-size13 py-[9px] px-[16px] bg-primary text-inverse-fg hover:bg-primary rounded-xs border border-solid border-primary hover:border-primary",
      },

      size: {
        default: "",
        sm: "!size-4xl rounded-md text-sm !p-0",
        lg: "h-10 rounded-md px-8",
        login: " rounded-[18px] h-[50px]",
        icon: "!p-0 flex justify-center items-center !size-4xl rounded-[7px]",
        "icon-circle":
          "h-[32px] w-[32px] flex justify-center items-center rounded-full !p-0",
        "panel-icon": "h-[36px] w-[36px] flex justify-center interface !p-0",
      },
      status: {
        default: "",
        "active-radio": "!bg-secondary",
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
  status?: "default" | "active-radio";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        // className={"h-8"}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        // onClick={
        //   props.onClick
        //     ? (e) => {
        //         if (props.onClick) e.preventDefault();
        //         props.onClick?.(e);
        //       }
        //     : undefined
        // }
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
