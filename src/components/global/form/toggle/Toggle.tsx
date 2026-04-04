import type {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";
import Info from "../../modal/Info";

interface ToggleProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  onChange?: () => void;
  info?: string | React.ReactNode;
}

function Toggle<T extends FieldValues>({
  form,
  name,
  label,
  onChange,
  info,
}: ToggleProps<T>) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer select-none flex-row">
      {label ? <span className="text-base">{label}</span> : null}
      <div className="flex items-center gap-5">
        <div
          onClick={(e) => {
            e.preventDefault();
            form.setValue(name, !form.watch(name) as PathValue<T, Path<T>>);
            onChange?.();
          }}
          className={`w-[35px] h-[20px] cursor-pointer rounded-full relative ${
            form.watch(name)
              ? "bg-primary hover:brightness-110"
              : "bg-tertiary-bg hover:brightness-110"
          } `}
          tabIndex={0}
          role="switch"
          aria-checked={!!form.watch(name)}
        >
          <div
            className={`size-[14px] rounded-full absolute top-[50%] -translate-y-[50%] start-[3px] ${
              form.watch(name)
                ? "bg-tertiary-bg translate-x-[15px] rtl:-translate-x-[15px]"
                : "bg-placeholder translate-x-0"
            } transition-all duration-[0.3s]`}
          ></div>
        </div>
        <div>{info ? <Info info={info} /> : null}</div>
      </div>
    </label>
  );
}

export default Toggle;
