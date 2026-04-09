import type { Dispatch, SetStateAction } from "react";

import { cn } from "../../../utils/cn";

export interface StepType {
  name: string;
  onClick: () => void;
}

interface StepperProps {
  currentStep: number;
  steps: StepType[];
  setCurrentStep: Dispatch<SetStateAction<number>>;
  className?: string;
  trackClassName?: string;
  itemClassName?: string;
}

// Stepper component receives currentStep and steps as props
const Stepper = ({
  currentStep,
  steps,
  className,
  trackClassName,
  itemClassName,
}: StepperProps) => {
  return (
    <div className={cn("flex w-full items-center justify-center", className)}>
      <div className={cn("flex w-full overflow-hidden", trackClassName)}>
        {steps.map((step, index) => {
          // Determine step state
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          // Color classes
          const base = isActive
            ? "bg-primary text-inverse-fg"
            : isCompleted
            ? "bg-primary text-inverse-fg"
            : "bg-secondary text-inverse-fg";
          // Only allow going back to previous steps, not forward
          // Prevent clicking on the first step if already on the first step
          const isClickable = index <= currentStep + 1;
          // Arrow shape using clip-path (LTR)
          return (
            <div
              key={step.name}
              className={cn(
                "relative flex min-h-[52px] flex-1 items-center justify-center px-3 text-center font-bold text-size14 transition-colors duration-[0.3s] sm:min-h-[58px] sm:px-4 md:text-size18",
                isClickable ? "cursor-pointer" : "cursor-default",
                base,
                itemClassName,
              )}
              style={{
                clipPath:
                  index === 0
                    ? steps.length === 1
                      ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)" // single step
                      : "polygon(7% 0, 100% 0, 100% 100%, 7% 100%, 0 50%)" // right arrow for first step, more angle (RTL)
                    : index === steps.length - 1
                    ? "polygon(0 0, 100% 0, 93% 50%, 100% 100%, 0 100%, 0 0)" // final step: arrow on right, flat on left, more angle (RTL)
                    : "polygon(0 50%, 7% 0, 100% 0, 93% 50%, 100% 100%, 7% 100%)", // middle steps, arrow on both sides
                zIndex: steps.length - index,
                opacity: isClickable || isActive ? 1 : 0.7,
              }}
              onClick={() => {
                if (isClickable) {
                  step?.onClick?.();
                }
              }}
            >
              <span className="w-full text-center select-none">
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Export the Stepper component as default
export default Stepper;
