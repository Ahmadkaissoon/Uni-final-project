import * as React from "react";
import { cn } from "@/utils/cn";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Button } from "./button";
import { type LucideIcon } from "lucide-react";
import { type IconType } from "react-icons/lib";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon | IconType;
  variant?: "white" | "default";
  wrapperClassName?: string;
  hasError?: boolean;
  addingElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      icon: Icon,
      wrapperClassName,
      variant,
      hasError,
      addingElement = null,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const toggleShowPassword = () => {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
      <React.Fragment>
        <div className={cn("relative w-full", wrapperClassName)}>
          {addingElement}
          <input
            type={showPassword ? "text" : type}
            className={cn(
              variant == "white"
                ? "flex h-[39px] w-full rounded-[5px] text-input-foreground bg-card py-[6px] ps-[12px] pe-[33px] border border-solid border-input text-13p font-medium placeholder:text-input-placeholder focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70 transition-all duration-[0.2s]"
                : "flex h-[39px] w-full rounded-[5px] text-input-foreground bg-input-background py-[9.5px] px-[14px] border border-solid border-input-background text-13p font-medium placeholder:text-input-placeholder focus-visible:outline-none focus-visible:border-input-border-focus focus-visible:bg-input-background-focus disabled:cursor-not-allowed disabled:bg-input-background-disabled disabled:text-input-placeholder transition-all duration-[0.2s]",
              type === "password" && "pe-11",
              className,
              !!Icon && "ps-9",
              hasError && "border-destructive focus-visible:border-destructive"
            )}
            ref={ref}
            {...props}
          />
          {type === "password" && (
            <Button
              type="button"
              size={"icon"}
              variant={"ghost-light"}
              onClick={toggleShowPassword}
              className="absolute bottom-[50%] translate-y-[50%] end-0 flex items-center px-2 rounded-sm text-muted-foreground"
            >
              {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </Button>
          )}
          {Icon && (
            <Icon className="absolute start-3.5 bottom-[50%] translate-y-[50%] h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </React.Fragment>
    );
  }
);

Input.displayName = "Input";

export { Input };
