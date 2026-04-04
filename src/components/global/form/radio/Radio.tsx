import type {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";
import { Button } from "../button/Button";
import type { IconType } from "react-icons/lib";

interface RadioProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  containerClassName?: string;
  required?: boolean;
  options: {
    label: string;
    value: string;
    chosenClassName?: string;
    className?: string;
    icon?: IconType;
  }[];
  className?: string;
  optionsContainerClassName?: string;
}
function Radio<T extends FieldValues>({
  form,
  name,
  label,
  containerClassName,
  required,
  options,
  className,
  optionsContainerClassName,
}: RadioProps<T>) {
  const currentValue = form.watch(name);
  return (
    <div className={`w-full block ${containerClassName}`}>
      {label ? (
        <label>
          {label}
          {required ? (
            <span className="text-destructive ms-[4px] text-[12px]">*</span>
          ) : null}
        </label>
      ) : null}
      <div
        defaultValue={options[0].value}
        className={`flex flex-wrap gap-[8px] ${optionsContainerClassName}`}
      >
        {options.map((option) => (
          <Button
            key={option.value}
            variant={"radio"}
            status={currentValue == option?.value ? "active-radio" : "default"}
            className={`${className} ${
              currentValue == option?.value
                ? option?.chosenClassName
                : option?.className ?? ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              form.setValue(name, option?.value as PathValue<T, Path<T>>);
            }}
          >
            <span className="font-semibold tracking-tight">{option.label}</span>
            {option?.icon ? <option.icon className="size-[16px]" /> : null}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default Radio;
