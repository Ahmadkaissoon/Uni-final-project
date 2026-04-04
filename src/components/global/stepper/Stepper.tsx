import type { Dispatch, SetStateAction } from "react";

export interface StepType {
  name: string;
  onClick: () => void;
}

interface StepperProps {
  currentStep: number;
  steps: StepType[];
  setCurrentStep: Dispatch<SetStateAction<number>>;
}

// Stepper component receives currentStep and steps as props
const Stepper = ({ currentStep, steps }: StepperProps) => {
  return (
    <div className="flex items-center justify-center w-full ">
      {/* LTR support */}
      <div className="flex overflow-hidden w-full 2xl:px-[200px] xl:px-[150px] lg:px-[100px] md:px-[50px] px-0">
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
              className={`relative flex-1 flex items-center justify-center font-bold md:text-size18 text-size14 px-md h-7xl ${
                isClickable ? "cursor-pointer" : "cursor-default"
              } transition-colors rounded-lg duration-[0.3s] ${base} `}
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
                // Prevent going back from first step to itself
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
