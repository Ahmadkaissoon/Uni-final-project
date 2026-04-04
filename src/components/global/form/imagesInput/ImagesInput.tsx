"use client";

import { useState, type ReactNode, useCallback } from "react";
import { FaRegImage, FaTrash } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { MdEdit } from "react-icons/md";
import { FcCancel } from "react-icons/fc";
import { BiSolidFolderOpen } from "react-icons/bi";
import getError from "@/utils/getErrors";
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";
import Toggle from "../toggle/Toggle";
import { PiStar, PiStarFill } from "react-icons/pi";
import { Tooltip, TooltipContent } from "../../tooltip/Tooltiop";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

interface ImageFile {
  id: number;
  path: string | File;
  mode?: "edit" | "delete";
  isMain: boolean;
}

interface ImagesInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  addable?: boolean;
  editable?: boolean;
  deletable?: boolean;
  acceptTypes?: string;
  className?: string;
  containerClassName?: string;
  imagesContainerClassName?: string;
  label?: string;
  customErrorStyle?: string;
  max?: number;
  disabled?: boolean;
  info?: string | ReactNode;
  toggle?: Path<T>;
  required?: boolean;
  labelStyle?: string;
}

function ImagesInput<T extends FieldValues>({
  form,
  name,
  addable = true,
  editable = true,
  deletable = true,
  acceptTypes = "image/*",
  imagesContainerClassName = "",
  containerClassName = "",
  label,
  max,
  className,
  disabled,
  toggle,
  required,
  labelStyle,
}: ImagesInputProps<T>) {
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = form;

  const [customFileId, setCustomFileId] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const isDisabled = disabled || (toggle && !watch(toggle));
  const [showOptions, setShowOptions] = useState<number | false>(false);

  const handleAddFiles = useCallback(
    async (files: FileList | File[]) => {
      let initFiles = watch(name) as (
        | { id: number; path: File; isMain: boolean }
        | PathValue<T, Path<T>>[number]
      )[];
      let newId = customFileId - 1;

      await Promise.all(
        Array.from(files).map((file) => {
          initFiles = [...initFiles, { id: newId, path: file, isMain: false }];
          newId -= 1;
        })
      );

      setValue(name, initFiles as PathValue<T, Path<T>>);
      setCustomFileId((prev) => prev - files.length);
      trigger(name);
    },
    [watch, name, setValue, trigger, customFileId]
  );

  const handleAddMultiFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await handleAddFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleEditMultiFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fileId: number
  ) => {
    const initFiles = watch(name).map((file: ImageFile) => {
      if (file.id !== fileId) return file;
      return {
        id: file.id,
        path: e.target.files?.[0] as File,
        mode: "edit" as const,
        isMain: file?.isMain,
      };
    });

    setValue(name, initFiles);
    trigger(name);
  };

  const handleDeleteMultiFile = async (fileId: number) => {
    const initFiles = watch(name).map((file: ImageFile) => {
      if (file.id !== fileId) return file;
      return { ...file, mode: "delete" as const, isMain: false };
    });

    setValue(name, initFiles);
    form.clearErrors(name);
    await trigger(name);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isDisabled || !addable) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleAddFiles(files);
    }
  };

  const currentFiles = watch(name)?.filter(
    (item: { mode?: "delete" | "edit" }) => item.mode !== "delete"
  );

  const canAddMore = !max || currentFiles?.length < max;

  return (
    <div className={`flex flex-col gap-xs ${containerClassName}`}>
      <div className="text-error flex justify-center mb-[10px] items-center text-center font-medium text-size14 min-h-[22px]">
        {getError(errors, name)
          ? (getError(errors, name) as { message: string })?.message
          : null}
      </div>

      {label ? (
        <label
          htmlFor={name}
          className={`text-size18 flex items-center gap-xl font-medium cursor-pointer ${labelStyle} ${
            isDisabled ? "text-placeholder" : " text-primary-fg"
          } transition-all`}
        >
          <div>
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

      <div
        className={`grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4xl ${imagesContainerClassName}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {watch(name)?.map((item: ImageFile, i: number) => {
          if (item?.mode == "delete") return null;
          return (
            <div className="flex flex-col gap-xs" key={item.id}>
              <div className="w-full h-[280px] rounded-full">
                <input
                  type="file"
                  id={`${name}__added_image_${i}`}
                  multiple={false}
                  onChange={async (e) => {
                    e.preventDefault();
                    await handleEditMultiFile(e, item.id);
                    e.target.value = "";
                  }}
                  accept={acceptTypes}
                  className="hidden"
                />

                <div
                  className="flex justify-center group/image items-center w-full h-[280px] border border-solid border-border rounded-xl overflow-hidden shrink-0 cursor-pointer relative"
                  onMouseEnter={() => setShowOptions(i)}
                  onMouseLeave={() => setShowOptions(false)}
                >
                  <div className="w-full h-[280px]">
                    <img
                      src={
                        typeof item.path === "object"
                          ? URL.createObjectURL(item.path)
                          : `${item.path?.replace("//static", "/static")}`
                      }
                      className="size-full object-cover"
                      alt={`Preview ${i + 1}`}
                    />
                  </div>

                  <AnimatePresence>
                    {showOptions === i && (
                      <motion.div
                        initial={{ translate: "0 100%" }}
                        animate={{ translate: 0 }}
                        exit={{ translate: "0 100%" }}
                        transition={{ ease: "linear", duration: 0.3 }}
                        className="absolute flex gap-2 justify-center items-center right-0 top-0 h-full w-full bg-primary-overlay backdrop-blur-[6px] text-primary-fg rounded-xl cursor-auto text-size20 font-bold"
                      >
                        {editable && (
                          <label
                            title="تعديل"
                            htmlFor={`${name}__added_image_${i}`}
                            className="text-primary-fg shadow-shadow bg-tertiary-bg/80 backdrop-blur-[6px] flex justify-center items-center p-sm rounded-full cursor-pointer"
                          >
                            <MdEdit className="shadow-shadow size-[20px]" />
                          </label>
                        )}

                        {deletable && (
                          <span
                            title="حذف"
                            className="text-error shadow-shadow bg-tertiary-bg/80 backdrop-blur-[6px] flex justify-center items-center p-sm rounded-full cursor-pointer"
                            onMouseDown={async () => {
                              await handleDeleteMultiFile(item.id);
                            }}
                          >
                            <FaTrash className="shadow-shadow size-[20px]" />
                          </span>
                        )}

                        <span
                          className="text-primary-fg shadow-shadow bg-tertiary-bg/80 backdrop-blur-[6px] flex justify-center items-center p-sm rounded-full cursor-pointer"
                          title="عرض"
                          onMouseDown={async () => {
                            const fileUrl =
                              typeof item.path === "object"
                                ? URL.createObjectURL(item.path)
                                : item.path?.replace("//static", "/static");
                            window.open(fileUrl);
                          }}
                        >
                          <BiSolidFolderOpen className="shadow-shadow size-[20px]" />
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute size-[28px] top-[10px] right-[10px]">
                    <div className="relative size-full flex items-center justify-center">
                      {item?.isMain ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <PiStarFill
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const initFiles = watch(name);
                                form.setValue(
                                  name,
                                  initFiles?.map(
                                    (item: ImageFile, index: number) => {
                                      if (index == i)
                                        return {
                                          ...(item ?? {}),
                                          isMain: false,
                                        };
                                      return item;
                                    }
                                  )
                                );
                                trigger(name);
                              }}
                              className="text-primary size-[28px] cursor-pointer"
                            />
                            <TooltipContent>
                              إزالة التعيين رئيسية
                            </TooltipContent>
                          </TooltipTrigger>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger>
                            <PiStar
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const initFiles = watch(name);
                                form.setValue(
                                  name,
                                  initFiles?.map(
                                    (item: ImageFile, index: number) => {
                                      if (index == i)
                                        return {
                                          ...(item ?? {}),
                                          isMain: true,
                                        };
                                      return item;
                                    }
                                  )
                                );
                                trigger(name);
                              }}
                              className="text-primary size-[28px] opacity-0 group-hover/image:opacity-100 transition-all duration-[0.3s] cursor-pointer"
                            />
                            <TooltipContent>تعيين كصورة رئيسية</TooltipContent>
                          </TooltipTrigger>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {getError(errors, `${name}.${i}.path` as Path<T>) ? (
                <span className="text-error font-medium text-size14">
                  {
                    (
                      getError(errors, `${name}.${i}.path` as Path<T>) as {
                        message: string;
                      }
                    )?.message
                  }
                </span>
              ) : getError(errors, `${name}.${i}` as Path<T>) ? (
                <span className="text-error font-medium text-size14">
                  {
                    (
                      getError(errors, `${name}.${i}` as Path<T>) as {
                        message: string;
                      }
                    )?.message
                  }
                </span>
              ) : null}
            </div>
          );
        })}

        {canAddMore &&
          (addable ? (
            <>
              <input
                type="file"
                id={`${name}__adding_mode`}
                multiple={true}
                onChange={handleAddMultiFile}
                className="hidden"
                accept={acceptTypes}
              />
              <label
                htmlFor={`${name}__adding_mode`}
                className={`relative flex flex-col gap-lg justify-center items-center w-full h-[280px] border-2 border-dashed ${
                  isDragging ? "border-primary-fg" : "border-border"
                } rounded-xl overflow-hidden shrink-0 cursor-pointer ${
                  className || ""
                } text-primary-fg/50 bg-tertiary-bg transition-colors`}
              >
                {isDragging ? (
                  <div className="absolute inset-0 bg-primary-overlay/50 flex items-center justify-center">
                    <span className="text-size18 font-medium">
                      أسقط الصور هنا
                    </span>
                  </div>
                ) : (
                  <>
                    <FaRegImage className="size-[100px]" />
                    <span className="text-size18 font-medium">
                      إدخال صور العقار
                    </span>
                    <span className="text-size16 text-placeholder">
                      أو اسحب وأسقط الصور هنا
                    </span>
                  </>
                )}
              </label>
            </>
          ) : (
            <div
              className={`flex justify-center items-center w-full h-[280px] border border-solid border-border rounded-xl overflow-hidden shrink-0 cursor-pointer ${
                className || ""
              } text-primary-fg/50 text-size44 bg-tertiary-bg`}
            >
              <FcCancel title="ليست لديك صلاحية" />
            </div>
          ))}
      </div>
    </div>
  );
}

export default ImagesInput;
