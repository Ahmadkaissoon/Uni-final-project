import { type ReactNode } from "react";
import {
  type UseFormReturn,
  type FieldValues,
  type Path,
} from "react-hook-form";
import Info from "../../modal/Info";
import getError from "@/utils/getErrors";

interface TextareaProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  placeholder?: string;
  name: Path<T>;
  label?: string;
  labelStyle?: string;
  disabled?: boolean;
  addingStyle?: string;
  addingTextareaStyle?: string;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  info?: string | ReactNode;
  addingValidStyle?: string;
  required?: boolean;
}

function Textarea<T extends FieldValues>({
  form,
  placeholder,
  name,
  label,
  labelStyle,
  disabled,
  addingStyle = "",
  addingValidStyle = "",
  addingTextareaStyle = "",
  onClick = () => {},
  onFocus = () => {},
  onBlur = () => {},
  info,
  required,
}: TextareaProps<T>) {
  const {
    register,
    formState: { errors },
  } = form;

  // helper function to check if field is valid
  function isValid<T extends FieldValues>(form: UseFormReturn<T>): boolean {
    const { formState } = form;

    return !!(formState.dirtyFields as Record<Path<T>, boolean>);
  }

  return (
    <>
      {/* other normal inputs */}
      <div
        className={`flex flex-col w-full gap-[4px] ${addingStyle}`}
        onClick={onClick}
      >
        {/* input label  */}
        {label ? (
          <label
            htmlFor={name}
            className={`text-size18 font-medium text-primary-fg cursor-pointer ${labelStyle}`}
          >
            <div className="flex items-center gap-sm">
              {label}
              {required ? (
                <span className="text-size18 text-error">{" *"}</span>
              ) : null}
            </div>
          </label>
        ) : null}

        <div className="w-full flex flex-col gap-xs">
          {/* input container to link icon to its position */}
          <div className="relative flex items-center gap-lg">
            <div className="relative flex-1 flex items-center overflow-hidden">
              {/* input with react hook form register control  */}
              {
                <textarea
                  placeholder={placeholder}
                  id={name}
                  {...(register ? register(name) : {})}
                  disabled={disabled}
                  className={`flex-1 h-[166px] text-size16 bg-input-bg p-lg border-[1.5px] text-primary-fg rounded-lg overflow-auto outline-none focus-visible:border-[3px] focus-visible:outline-none placeholder:text-placeholder transition-colors duration-[0.3s] ${
                    getError(errors, name)
                      ? "border-error"
                      : `${
                          isValid(form)
                            ? "focus-visible:border-success"
                            : "focus-visible:border-secondary"
                        } hover:border-secondary ${
                          addingValidStyle
                            ? addingValidStyle
                            : "border-secondary-border"
                        }`
                  }  ${addingTextareaStyle}`}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              }
            </div>

            {/* beside element */}
            {info ? <Info info={info} /> : null}
          </div>

          {/* validation errors  */}
          {getError(errors, name) ? (
            <span className="text-error font-medium text-size14">
              {(getError(errors, name) as { message: string })?.message}
            </span>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Textarea;
