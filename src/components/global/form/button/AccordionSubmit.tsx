import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Button } from "./Button";
import type { FieldValues, Path, UseFormTrigger } from "react-hook-form";

interface AccordionSubmitProps<T extends FieldValues> {
  trigger: UseFormTrigger<T>;
  onValid: () => void;
  validationArray: Path<T>[];
}
function AccordionSubmit<T extends FieldValues>({
  trigger,
  onValid,
  validationArray,
}: AccordionSubmitProps<T>) {
  return (
    <Button
      className="!bg-success min-w-[170px]"
      onClick={async (e) => {
        e.preventDefault();
        const isValid = await trigger(validationArray, {
          shouldFocus: true,
        });
        if (isValid) onValid?.();
      }}
    >
      تأكيد البيانات
    </Button>
  );
}

export default AccordionSubmit;

interface AccordionCancelProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export function AccordionCancel({ setIsOpen }: AccordionCancelProps) {
  return (
    <Button
      className="!bg-error min-w-[170px]"
      onClick={async (e) => {
        e.preventDefault();
        setIsOpen(false);
      }}
    >
      إغلاق
    </Button>
  );
}

interface AccordionButtonsContainerProps {
  children: ReactNode;
  className?: string;
}
export function AccordionButtonsContainer({
  children,
  className,
}: AccordionButtonsContainerProps) {
  return (
    <div
      className={`col-span-full flex justify-center gap-[30px] mt-[40px] ${className}`}
    >
      {children}
    </div>
  );
}
