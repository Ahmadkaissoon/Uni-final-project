import { type ReactNode } from "react";
import { BiSolidFileDoc } from "react-icons/bi";
import { FaArrowDown } from "react-icons/fa";
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";
import getError from "@/utils/getErrors";

interface FileInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  acceptTypes?: string;
  className?: string;
  containerClassName?: string;
  label?: string;
  placeholder?: string;
  secondaryText?: string;
  customErrorStyle?: string;
  disabled?: boolean;
  info?: string | ReactNode;
  required?: boolean;
  labelStyle?: string;
  onChange?: (file: File | null) => void;
}

function FileInput<T extends FieldValues>({
  form,
  name,
  acceptTypes = "application/pdf",
  containerClassName = "",
  label,
  placeholder = "أدخل ملف",
  secondaryText = "أو اسحب و أسقط الملف هنا",
  disabled,
  labelStyle,
  onChange,
}: FileInputProps<T>) {
  const {
    setValue,
    formState: { errors },
  } = form;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setValue(name, selectedFile as PathValue<T, Path<T>>);

    if (onChange) {
      onChange(selectedFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] ?? null;
    setValue(name, file as PathValue<T, Path<T>>);
    if (onChange) onChange(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const inputId = `file-${name}`;
  const error = getError(errors, name);

  return (
    <>
      <div className={`flex flex-col gap-10 ${containerClassName}`}>
        {label && (
          <div className="gap-2 border p-4 rounded border-dashed flex items-center justify-center">
            <span className={`text-size16 font-medium ${labelStyle}`}>
              {label}
            </span>
            <FaArrowDown className="text-2xl text-primary-fg animate-bounce" />
          </div>
        )}

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-primary-fg rounded-lg p-8 text-center w-[400px] h-[400px] flex justify-center items-center"
        >
          <input
            type="file"
            accept={acceptTypes}
            onChange={handleFileChange}
            className="hidden"
            id={inputId}
            disabled={disabled}
          />
          <label htmlFor={inputId} className="cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              <BiSolidFileDoc className="text-6xl text-primary-fg" />
              <div className="text-center">
                <p className="text-size16 font-medium text-primary-fg mb-1">
                  {placeholder}
                </p>
                <p className="text-size14 text-placeholder">{secondaryText}</p>
              </div>
            </div>
          </label>
        </div>

        {error && (
          <p className="text-red-500 text-size14 mt-1">{error.message}</p>
        )}
      </div>

      <style>{`
        .react-pdf__Page__textContent,
        .react-pdf__Page__annotations {
          display: none !important;
        }
      `}</style>
    </>
  );
}

export default FileInput;
