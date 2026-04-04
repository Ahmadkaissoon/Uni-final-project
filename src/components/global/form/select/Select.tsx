import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type KeyboardEventHandler,
  type ReactNode,
  type SetStateAction,
} from "react";
import ErrorComponent from "../../error/ErrorComponent";
import Loader from "../../loader/Loader";
import { FaXmark } from "react-icons/fa6";
import handleClickOutside from "@/utils/handleClickOutside";
import { isArray } from "lodash";
import EmptyContent from "../../emptyContent/EmptyContent";
import {
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormReturn,
} from "react-hook-form";
import getError, { isValid } from "@/utils/getErrors";
import { FaAngleDown } from "react-icons/fa6";
import Toggle from "../toggle/Toggle";
import Info from "../../modal/Info";

interface SelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  placeholder?: string;
  name: Path<T>;
  label?: string;
  labelStyle?: string;
  element?: ReactNode;
  disabled?: boolean;
  choices?: Array<Record<string, ReactNode> | string>;
  showValue?: string;
  keyValue?: string;
  isLoading?: boolean;
  isError?: boolean;
  emptyValue?: null | undefined | "";
  addingStyle?: string;
  addingInputStyle?: string;
  addingSelectStyle?: string;
  variant?: "default" | "contract";
  customTrigger?: ({
    setIsOpen,
    isOpen,
  }: {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    isOpen?: boolean;
  }) => ReactNode;
  addingElement?: (data: { isOpen: boolean }) => ReactNode;
  choiceElement?: (data: {
    choice: Record<string, ReactNode> | string;
  }) => ReactNode;
  multiple?: boolean;
  preventRemove?: boolean;
  belowComponent?: () => ReactNode;
  formId?: string;
  query?: unknown;
  info?: string | ReactNode;
  toggle?: Path<T>;
  required?: boolean;
  onChange?: (data: any) => void;
}

function Select<T extends FieldValues>({
  form,
  placeholder,
  name,
  label,
  labelStyle,
  // element,
  disabled,
  choices = [],
  showValue,
  keyValue,
  isLoading,
  isError,
  emptyValue = null,
  addingStyle = "",
  addingInputStyle = "",
  addingSelectStyle = "",
  variant = "default",
  addingElement = () => null,
  choiceElement = () => null,
  multiple = false,
  preventRemove = false,
  belowComponent,
  formId, // query
  info,
  toggle,
  required,
  customTrigger,
  onChange,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const clickRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => handleClickOutside(clickRef, setIsOpen, null), []);
  const {
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = form;

  const isDisabled = disabled || (toggle && !watch(toggle));

  // handle choice click
  function handleChoiceClick(
    e: MouseEvent,
    choice: Record<string, ReactNode> | string,
    key?: number
  ) {
    if ((e?.target as HTMLElement)?.id == "prevent-click") return;
    let finalChoice = choice;
    if (typeof finalChoice == "string") {
      const [rtlPart, ltrPart] = (finalChoice as string).split(" - ");
      if (ltrPart) (finalChoice as string) = `${ltrPart} - ${rtlPart}`;
    }

    const isChoosen = multiple
      ? keyValue
        ? (watch(name) ?? [])?.filter(
            (ele: Record<string, ReactNode>) =>
              ele?.[showValue as string] ==
              (finalChoice as Record<string, ReactNode>)?.[showValue as string]
          )?.length
        : (watch(name) as string)?.includes(finalChoice as string)
      : keyValue
      ? (finalChoice as Record<string, ReactNode>)[keyValue] ==
        (watch(name) as Record<string, ReactNode>)?.[keyValue]
      : finalChoice == watch(name);

    // remove
    if (isChoosen) {
      if (preventRemove) return;
      // if multiple
      if (multiple) {
        if (keyValue) {
          const index = (watch(name) as Record<string, ReactNode>[]).findIndex(
            (ele: Record<string, ReactNode>) =>
              ele[keyValue] ==
              (finalChoice as Record<string, ReactNode>)[keyValue]
          );
          const newValue = [...(watch(name) ?? [])];
          newValue.splice(index, 1);
          setValue(name, newValue as PathValue<T, Path<T>>);
          onChange?.(newValue);
        } else {
          const index = (watch(name) as string[]).findIndex(
            (ele: string) => ele == finalChoice
          );
          const newValue = [...(watch(name) ?? [])];
          newValue.splice(index, 1);
          setValue(name, newValue as PathValue<T, Path<T>>);
          onChange?.(newValue);
        }
      }
      // single
      else setValue(name, emptyValue as PathValue<T, Path<T>>);
      onChange?.(emptyValue);
    }
    // add
    else {
      // multiple
      if (multiple) {
        setValue(name, [...(watch(name) ?? []), finalChoice] as PathValue<
          T,
          Path<T>
        >);
        onChange?.([...(watch(name) ?? []), finalChoice]);
      }
      // single
      else {
        setValue(name, finalChoice as PathValue<T, Path<T>>);
        setIsOpen(false);
        onChange?.(finalChoice);
      }
    }
    trigger(name);
    if (key !== undefined) setFocusedChoose(key);
  }

  // the focused option
  const [focusedChoose, setFocusedChoose] = useState<number | null>(null);
  // scroll to the focused row to be on screen
  useEffect(() => {
    if (focusedChoose !== null) {
      document
        .getElementById(`option_${name}_${focusedChoose}_${formId}`)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
    }
  }, [focusedChoose, isOpen, formId, name]);
  // handle press down and up key press
  const handleKeyDown: KeyboardEventHandler<HTMLButtonElement> = (e) => {
    // transition up and down between the options
    if (e.key == "ArrowDown" && !e.ctrlKey) {
      e.preventDefault();
      setFocusedChoose((prev) => {
        return choices?.length == 0
          ? null
          : prev === null
          ? 0
          : Math.min(prev + 1, choices?.length - 1);
      });
    } else if (e.key == "ArrowUp") {
      e.preventDefault();
      setFocusedChoose((prev) => {
        return choices?.length == 0
          ? null
          : prev === null
          ? null
          : Math.max(prev - 1, 0);
      });
    } else if (e.key == "Enter") {
      e.preventDefault();
      // choose the focused option
      if (focusedChoose !== null && isOpen) {
        handleChoiceClick(
          e as unknown as MouseEvent,
          choices?.[focusedChoose],
          focusedChoose
        );
      }
      // open select options
      if (!isOpen) setIsOpen(true);
    } else if (e.key == "Tab") {
      setIsOpen(false);
    }
  };

  // scroll to the end of options section when open the select field options
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref?.current && isOpen) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isOpen]);

  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <div className={`flex flex-col w-full max-w-full gap-xs ${addingStyle}`}>
      {/* select label  */}
      {label ? (
        <label
          htmlFor={name}
          className={`text-size18 font-medium cursor-pointer ${labelStyle} ${
            isDisabled ? "text-placeholder" : " text-primary-fg"
          } transition-all`}
        >
          <div className="flex items-center gap-sm">
            {label}
            {required && !isDisabled ? (
              <span className="text-size18 text-error">{" *"}</span>
            ) : null}
          </div>

          {toggle ? (
            <Toggle form={form} name={toggle} onChange={() => trigger(name)} />
          ) : null}
        </label>
      ) : null}

      {/* select container to link choices list to its position */}
      <div
        ref={clickRef}
        className={`relative w-full max-w-full flex items-center gap-lg ${addingSelectStyle}`}
      >
        <div
          className={`flex-1 relative ${
            info ? "max-w-[calc(100%_-_40px)]" : "max-w-full"
          } flex items-center`}
        >
          {/* select */}
          {customTrigger ? (
            customTrigger({ setIsOpen, isOpen })
          ) : (
            <button
              type="button"
              className={`cursor-pointer flex items-center gap-[8px] flex-1 overflow-auto ${
                variant === "contract" ? "h-12 max-w-[200px]" : "h-5xl"
              } text-size16 ${
                isDisabled
                  ? "bg-transparent"
                  : variant === "contract"
                  ? "bg-transparent"
                  : "bg-input-bg"
              } ${variant === "contract" ? "px-0" : "px-lg"} ${
                variant === "contract" ? "border-0 border-b " : "border-[1.5px]"
              } text-primary-fg ${
                variant === "contract"
                  ? "rounded-none min-w-[150px] !h-[32px]"
                  : "rounded-lg"
              } outline-none ${
                variant === "contract"
                  ? "focus-visible:border-b-2 focus-visible:border-blue-500"
                  : "focus-visible:border-[3px]"
              } focus-visible:outline-none placeholder:text-placeholder transition-colors duration-[0.3s] ${
                isDisabled
                  ? "border-placeholder !cursor-not-allowed"
                  : getError(errors, name)
                  ? "border-error"
                  : variant === "contract"
                  ? `border-b `
                  : `border-secondary-border ${
                      isValid(form)
                        ? "focus-visible:border-success"
                        : "focus-visible:border-secondary"
                    } hover:border-secondary`
              } ${addingInputStyle} flex justify-between items-center`}
              onKeyDown={handleKeyDown}
              onClick={(e) => {
                e.preventDefault();
                if (!isDisabled) setIsOpen((prev) => !prev);
              }}
            >
              <div className="overflow-auto text-nowrap flex-1 flex text-start">
                {(watch(name) && !isArray(watch(name))) ||
                (isArray(watch(name)) && watch(name).length) ? (
                  !multiple ? (
                    showValue ? (
                      (watch(name) as Record<string, ReactNode>)[showValue]
                    ) : (
                      (watch(name) as string)
                    )
                  ) : showValue ? (
                    <div className="flex flex-1 overflow-auto items-center gap-md">
                      {(watch(name) as Record<string, ReactNode>[]).map(
                        (ele: Record<string, ReactNode>, index: number) => {
                          return (
                            <div
                              key={index}
                              className="py-xxs group px-md flex items-center gap-xs rounded-full border border-placeholder bg-transparent text-placeholder text-size16"
                            >
                              {ele[showValue]}

                              <FaXmark
                                data-print-hidden={true}
                                className="size-[16px] text-placeholder/60 w-0 group-hover:w-[16px] hover:text-placeholder transition-all duration-[0.2s]"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (!isDisabled)
                                    handleChoiceClick(
                                      e as unknown as MouseEvent,
                                      ele
                                    );
                                }}
                              />
                            </div>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-1 items-center overflow-auto gap-md">
                      {(watch(name) as string[]).map(
                        (ele: string, index: number) => {
                          return (
                            <div
                              key={index}
                              className="py-xxs group px-lg flex items-center gap-xs rounded-full border border-placeholder bg-transparent text-placeholder text-size16"
                            >
                              {ele}

                              <FaXmark
                                data-print-hidden={true}
                                className="size-[16px] text-placeholder/60 w-0 group-hover:w-[16px] hover:text-placeholder transition-all duration-[0.2s]"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (!isDisabled)
                                    handleChoiceClick(
                                      e as unknown as MouseEvent,
                                      ele
                                    );
                                }}
                              />
                            </div>
                          );
                        }
                      )}
                    </div>
                  )
                ) : (
                  <span className="text-placeholder">{placeholder}</span>
                )}
              </div>

              {/* delete option */}
              {!multiple && !preventRemove && watch(name) ? (
                <span
                  title="إفراغ"
                  data-print-hidden={true}
                  className={`relative font-light text-size12 p-1 text-error rounded-full bg-error/30 opacity-50 hover:opacity-100 transition-all duration-[0.2s] mr-auto`}
                >
                  <FaXmark />
                  <div
                    className="absolute w-full h-full top-0 left-0"
                    id={`dont-close`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDisabled)
                        handleChoiceClick(
                          e as unknown as MouseEvent,
                          watch(name)
                        );
                    }}
                  ></div>
                </span>
              ) : null}

              {/* select arrow */}
              <div
                data-print-hidden={true}
                className={`relative toggle-button ${
                  isDisabled
                    ? "text-placeholder"
                    : `${isOpen ? "text-secondary" : "text-primary"}`
                } ${
                  isOpen ? "rotate-180 duration-[0.3s]" : "duration-[0.3s]"
                } transition-all`}
              >
                <FaAngleDown />
              </div>
            </button>
          )}

          {/* choices list */}
          <div
            className={`bg-tertiary-bg/65 backdrop-blur-[15px] min-w-[200px] rounded-b-[6px] z-[15] absolute bottom-0 translate-y-full w-full ${
              isOpen
                ? "h-[240px] overflow-auto py-xs pt-0"
                : "h-0 overflow-hidden"
            } transition-all flex flex-col gap-xs px-xs shadow-md `}
          >
            {variant !== "contract" && (
              <div className="bg-tertiary-bg/65 backdrop-blur-[15px] pt-md z-[2] sticky top-0">
                <input
                  type="text"
                  id={`select_${name}_search_${formId}`}
                  // autoFocus={true}
                  className="w-full text-size16 outline-none focus:outline-none focus-visible:outline-none bg-tertiary-bg backdrop-blur-[15px] py-sm px-lg border-solid border border-border text-primary-fg/90 rounded-sm"
                  placeholder="بحث..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  autoComplete={"off"}
                  onKeyDown={(e) => {
                    if (e.key == "ArrowDown") {
                      e.preventDefault();
                    } else if (e.key == "ArrowUp") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            )}

            <div className="h-full overflow-auto  text-size16 flex flex-col gap-md">
              {isError ? (
                <ErrorComponent />
              ) : isLoading ? (
                <Loader />
              ) : choices?.length == 0 ? (
                <EmptyContent />
              ) : (
                choices?.map(
                  (choice: Record<string, ReactNode> | string, key: number) => {
                    let finalChoice = choice;
                    if (typeof finalChoice == "string") {
                      const [rtlPart, ltrPart] = (finalChoice as string).split(
                        " - "
                      );
                      if (ltrPart) finalChoice = `${ltrPart} - ${rtlPart}`;
                    }

                    const isChoosen = multiple
                      ? keyValue
                        ? (watch(name) as Record<string, ReactNode>[])?.filter(
                            (ele: Record<string, ReactNode>) =>
                              ele[showValue as string] ==
                              (finalChoice as Record<string, ReactNode>)[
                                showValue as string
                              ]
                          )?.length
                        : (watch(name) as string[])?.includes(
                            finalChoice as string
                          )
                      : keyValue
                      ? (finalChoice as Record<string, ReactNode>)[keyValue] ==
                        watch(name)?.[keyValue]
                      : finalChoice == watch(name);

                    if (
                      variant === "contract" ||
                      !searchTerm ||
                      (!showValue &&
                        (finalChoice as string)?.includes(searchTerm)) ||
                      (showValue &&
                        (
                          (finalChoice as Record<string, ReactNode>)?.[
                            showValue
                          ] as string
                        )?.includes(searchTerm))
                    )
                      return (
                        <div
                          key={key}
                          onClick={(e) => {
                            if (!isDisabled)
                              handleChoiceClick(
                                e as unknown as MouseEvent,
                                choice,
                                key
                              );
                          }}
                          className={`py-md px-lg flex  items-center cursor-pointer group relative ${
                            focusedChoose == key
                              ? variant
                                ? "border border-gray-300"
                                : "border-solid border border-primary"
                              : "border-solid border border-transparent"
                          } ${
                            isChoosen
                              ? variant
                                ? "bg-[#A3D3F5]"
                                : "bg-secondary/50 rounded-md text-primary-fg"
                              : "hover:bg-secondary/20 rounded-md text-primary-fg/80"
                          } transition-all duration-[0.1s]`}
                          id={`option_${name}_${key}_${formId}`}
                        >
                          {showValue
                            ? (choice as Record<string, ReactNode>)[showValue]
                            : (choice as ReactNode)}
                          {choiceElement({ choice })}
                        </div>
                      );
                  }
                )
              )}
            </div>
          </div>
        </div>

        {/* pseudo div to scroll to it when open the select to show the whole options section body on screen */}
        {isOpen ? (
          <div ref={ref} className="absolute top-[280px] h-lg w-lg"></div>
        ) : null}

        {/* adding element */}
        {addingElement({ isOpen })}

        {/* beside element */}
        {info ? <Info info={info} /> : null}
      </div>

      {/* validation errors  */}
      {getError(errors, name) ? (
        <span className="text-error font-medium text-size14">
          {(getError(errors, name) as { message: string })?.message}
        </span>
      ) : null}
      {belowComponent ? belowComponent() : null}
    </div>
  );
}

export default Select;
