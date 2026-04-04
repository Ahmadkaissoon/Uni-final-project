import { useState, useRef, useEffect, type ReactNode } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import {
  type UseFormTrigger,
  type UseFormReturn,
  type FieldValues,
  type Path,
  type PathValue,
} from "react-hook-form";
import Info from "../../modal/Info";
import getError, { isValid } from "@/utils/getErrors";
import Toggle from "../toggle/Toggle";

interface InputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  type?: string;
  placeholder?: string;
  name: Path<T>;
  label?: string;
  labelStyle?: string;
  element?: React.ReactNode;
  disabled?: boolean;
  addingStyle?: string;
  addingInputStyle?: string;
  customInput?: React.ReactNode;
  step?: number;
  numberRegex?: RegExp;
  onClick?: () => void;
  onFocus?: () => void;
  onChange?: (data: { trigger: UseFormTrigger<T> }) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  info?: string | ReactNode;
  addingValidStyle?: string;
  bottomElement?: string | ReactNode;
  required?: boolean;
  toggle?: Path<T>;
  variant?: string;
  // Flexible width props
  flexibleWidth?: boolean;
  minWidth?: string;
  maxWidth?: string;
}

function Input<T extends FieldValues>({
  form,
  type = "text",
  placeholder,
  name,
  label,
  labelStyle,
  element,
  disabled,
  addingStyle = "",
  addingValidStyle = "",
  addingInputStyle = "",
  customInput,
  step = 1,
  numberRegex = /^\d*\.?\d*$/,
  onClick = () => {},
  onFocus = () => {},
  onChange = () => {},
  onBlur = () => {},
  min,
  max,
  info,
  bottomElement,
  required,
  toggle,
  variant,
  flexibleWidth = false,
  minWidth = "150px",
  maxWidth = "700px",
}: InputProps<T>) {
  const [show, setShow] = useState(false);
  const [dynamicWidth, setDynamicWidth] = useState("max-content");
  const flexibleWidthRef = useRef<HTMLSpanElement>(null);

  const {
    watch,
    register,
    setValue,
    formState: { errors },
    trigger,
  } = form;

  const toggleValue = toggle ? watch(toggle) : undefined;
  const isDisabled = disabled || (toggle && !watch(toggle));

  // Get the text to measure for flexible width
  const measureText = watch?.(name) || placeholder || "";

  // Update width when measureText changes
  useEffect(() => {
    if (flexibleWidth && flexibleWidthRef.current) {
      const newWidth = flexibleWidthRef.current.offsetWidth;
      setDynamicWidth(`${newWidth + 8}px`);
    }
  }, [measureText, flexibleWidth]);

  const handleToggleChange = () => {
    if (toggle) {
      setValue(toggle, !toggleValue as PathValue<T, Path<T>>);
      trigger?.(toggle);
    }
    trigger?.(name);
  };

  // Base input classes for different variants
  const getBaseInputClasses = () => {
    if (variant === "contract") {
      return `w-full h-8 text-size15 pt-3.5 rounded-none outline-none duration-[0.3s] ${
        type === "password" ? "!pl-[56px]" : ""
      }`;
    }

    return `flex-1 h-5xl text-size16 ${
      isDisabled ? "bg-secondary-background" : "bg-input-bg"
    } p-lg border-[1.5px] text-primary-fg rounded-lg overflow-auto outline-none focus-visible:border-[3px] focus-visible:outline-none placeholder:text-placeholder transition-colors duration-[0.3s] ${
      getError(errors, name)
        ? "border-error"
        : `${
            isValid(form)
              ? "focus-visible:border-success"
              : "focus-visible:border-secondary"
          } hover:border-secondary ${
            addingValidStyle ? addingValidStyle : "border-secondary-border"
          }`
    } ${type === "password" ? "!pl-[56px]" : ""}`;
  };

  // Render flexible text input
  const renderFlexibleInput = () => {
    const baseClasses = getBaseInputClasses();

    return (
      <div
        className={`${
          variant === "contract"
            ? "relative flex items-center"
            : "relative flex items-center"
        }`}
      >
        <div
          className={`${
            variant === "contract"
              ? "relative"
              : "relative flex-1 overflow-hidden"
          }`}
        >
          {/* Grid container for flexible width */}
          <div
            className="inline-grid grid-cols-1 items-center border-b"
            style={{
              width: "max-content",
            }}
          >
            {/* Hidden measuring span */}
            <span
              ref={flexibleWidthRef}
              data-print-visible={true}
              className={`invisible pointer-events-none !w-max whitespace-pre col-start-1 row-start-1 ${
                variant === "contract"
                  ? "h-8 text-size15 pt-3.5"
                  : "h-5xl text-size16 p-lg"
              } ${type === "password" ? "pl-[56px]" : ""}`}
              style={{
                minWidth,
                maxWidth,
                border:
                  variant === "contract"
                    ? "1px solid transparent"
                    : "1.5px solid transparent",
              }}
            >
              {measureText}
            </span>

            {/* Actual input */}
            {type === "custom" ? (
              customInput
            ) : type === "number" ? (
              <input
                type="number"
                placeholder={placeholder}
                id={name}
                {...(register ? register(name) : {})}
                disabled={isDisabled}
                className={`${baseClasses} ${addingInputStyle} col-start-1 row-start-1`}
                style={{
                  width: dynamicWidth,
                }}
                onChange={(e) => {
                  if (
                    numberRegex.test(e.target.value) &&
                    (!min || Number(e.target.value) >= min) &&
                    (!max || Number(e.target.value) <= max)
                  ) {
                    if (e.target.value === "") {
                      setValue(name, undefined as PathValue<T, Path<T>>);
                    } else {
                      setValue(
                        name,
                        Number(e.target.value) as PathValue<T, Path<T>>
                      );
                    }
                    trigger?.(name);
                  }
                }}
                value={watch?.(name) ?? undefined}
                step={step}
                data-print-hidden={true}
              />
            ) : (
              <input
                data-print-hidden={true}
                type={show ? "text" : type}
                placeholder={placeholder}
                id={name}
                {...(register ? register(name) : {})}
                disabled={isDisabled}
                className={`${baseClasses} ${addingInputStyle} col-start-1 row-start-1`}
                style={{
                  width: dynamicWidth,
                }}
                step={step}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            )}
          </div>

          {/* Password toggle icon */}
          {type === "password" && (
            <div
              className="text-primary-fg/80 hover:text-primary-fg/100 transition-all absolute h-[calc(100%_-_3.28px)] rounded-l-[12.27px] aspect-square left-[1.64px] bg-transparent top-[50%] -translate-y-[50%] flex justify-center items-center cursor-pointer"
              onClick={() => {
                if (type === "password") setShow(!show);
              }}
            >
              {show ? <FaEyeSlash /> : <FaEye />}
            </div>
          )}
        </div>

        {info && <Info info={info} />}
      </div>
    );
  };

  // Render regular input (original implementation)
  const renderRegularInput = () => (
    <div
      className={`${
        variant === "contract"
          ? "relative flex items-center"
          : "relative flex items-center"
      }`}
    >
      <div
        className={`${
          variant === "contract"
            ? "relative w-32 flex items-center overflow-hidden"
            : "relative flex-1 flex items-center overflow-hidden"
        }`}
      >
        {type === "custom" ? (
          customInput
        ) : type === "number" ? (
          <input
            type="number"
            placeholder={placeholder}
            id={name}
            {...(register ? register(name) : {})}
            disabled={isDisabled}
            className={`${getBaseInputClasses()} ${addingInputStyle}`}
            onChange={(e) => {
              if (
                numberRegex.test(e.target.value) &&
                (!min || Number(e.target.value) >= min) &&
                (!max || Number(e.target.value) <= max)
              ) {
                if (e.target.value === "") {
                  setValue(name, undefined as PathValue<T, Path<T>>);
                } else {
                  setValue(
                    name,
                    Number(e.target.value) as PathValue<T, Path<T>>
                  );
                }
                trigger?.(name);
              }
            }}
            value={watch?.(name) ?? undefined}
            step={step}
          />
        ) : (
          <input
            type={show ? "text" : type}
            placeholder={placeholder}
            id={name}
            {...(register ? register(name) : {})}
            disabled={isDisabled}
            className={`${getBaseInputClasses()} ${addingInputStyle}`}
            step={step}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        )}

        {type === "password" && (
          <div
            className="text-primary-fg/80 hover:text-primary-fg/100 transition-all absolute h-[calc(100%_-_3.28px)] rounded-l-[12.27px] aspect-square left-[1.64px] bg-transparent top-[50%] -translate-y-[50%] flex justify-center items-center cursor-pointer"
            onClick={() => {
              if (type === "password") setShow(!show);
            }}
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </div>
        )}
      </div>

      {info && <Info info={info} />}
    </div>
  );

  return (
    <>
      {/* Checkbox input */}
      {type === "checkbox" ? (
        <div className={`flex flex-col ${addingStyle}`}>
          <label
            htmlFor={name}
            className={`flex items-center gap-1 cursor-pointer text-size20 ${addingInputStyle}`}
          >
            <input
              type={type}
              className=""
              id={name}
              {...(register ? register(name) : {})}
              disabled={isDisabled}
              onChange={(e) => {
                setValue(
                  name,
                  (e?.target?.checked ? true : false) as PathValue<T, Path<T>>
                );
                trigger?.(name);
                onChange({ trigger } as { trigger: UseFormTrigger<T> });
              }}
              checked={watch?.(name) ? true : false}
            />
            <div className="w-[20px] max-w-[20px] min-w-[20px] h-[20px] max-h-[20px] min-h-[20px] bg-secondary-background rounded-sm right-[2px] peer-checked:bg-secondary-foreground transition-all duration-[0.1s]"></div>

            <div className="flex items-center gap-2">
              {label}
              {required && !isDisabled ? (
                <span className="text-size22 text-error">{" *"}</span>
              ) : null}
              {toggle && (
                <Toggle
                  form={form}
                  name={toggle}
                  label=""
                  onChange={handleToggleChange}
                />
              )}
            </div>
            {element}
          </label>
          {getError(errors, name) && (
            <span className="text-error text-size14">
              {(getError(errors, name) as { message: string })?.message}
            </span>
          )}
        </div>
      ) : type === "tags" ? (
        /* Tags input */
        <div className={`flex flex-col ${addingStyle}`}>
          <label
            htmlFor={name}
            className={`flex items-center gap-2 cursor-pointer ${addingInputStyle}`}
          >
            <input
              type="checkbox"
              className="peer hidden"
              id={name}
              {...(register ? register(name) : {})}
              disabled={isDisabled}
              onChange={(e) => {
                setValue(
                  name,
                  (e?.target?.checked ? true : false) as PathValue<T, Path<T>>
                );
                trigger?.(name);
                onChange({ trigger } as { trigger: UseFormTrigger<T> });
              }}
              checked={watch?.(name) ? true : false}
            />

            <div className="px-3xl py-xl bg-transparent rounded-md border border-secondary-border peer-checked:bg-primary/10 peer-checked:border-primary transition-colors duration-150 w-[200px] text-center select-none flex items-center justify-center text-secondary-border peer-checked:text-primary text-size14 h-[40px]">
              {label}
            </div>
            {element}
          </label>
          {getError(errors, name) && (
            <span className="text-error text-size14">
              {(getError(errors, name) as { message: string })?.message}
            </span>
          )}
        </div>
      ) : (
        /* Text inputs */
        <div
          className={`${
            variant === "contract"
              ? "flex items-center gap-2"
              : "flex flex-col w-full gap-xs"
          } ${addingStyle}`}
          onClick={onClick}
        >
          {/* Input label */}
          {label && (
            <label
              htmlFor={name}
              className={`text-size18 font-medium cursor-pointer ${labelStyle} ${
                isDisabled ? "text-placeholder" : " text-primary-fg"
              } transition-all`}
            >
              <span className="flex items-center gap-sm">
                {label}
                {variant === "contract" ? " :" : ""}
                {required && !isDisabled ? (
                  <span className="text-size18 text-error">{" *"}</span>
                ) : null}
                {toggle && (
                  <Toggle
                    form={form}
                    name={toggle}
                    onChange={handleToggleChange}
                  />
                )}
              </span>
            </label>
          )}

          <div
            className={`${
              variant === "contract" ? "flex-1" : "w-full flex flex-col"
            }`}
          >
            {/* Render flexible or regular input based on flexibleWidth prop */}
            {flexibleWidth ? renderFlexibleInput() : renderRegularInput()}

            {/* Validation errors */}
            {getError(errors, name) && (
              <span className="text-error font-medium text-size14">
                {(getError(errors, name) as { message: string })?.message}
              </span>
            )}

            {/* Bottom element */}
            {bottomElement}
          </div>
        </div>
      )}
    </>
  );
}

export default Input;
