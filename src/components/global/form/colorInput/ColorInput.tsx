import { colorPaletteAtom, type ColorPalette } from "@/stores/colorPalett";
import { cn } from "@/utils/cn";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";

type ColorInputProps = {
  label: string;
  variable: keyof ColorPalette;
  description?: string;
  className?: string;
};

export const ColorInput = ({
  label,
  variable,
  description,
  className,
}: ColorInputProps) => {
  const palette = useAtomValue(colorPaletteAtom);
  const setPalette = useSetAtom(colorPaletteAtom);

  const handleChange = useCallback(
    (value: string) => {
      setPalette((prev) => ({
        ...prev,
        [variable]: value,
      }));

      // Update CSS variable immediately
      document.documentElement.style.setProperty(
        `--${variable.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
        value
      );
    },
    [setPalette, variable]
  );

  return (
    <div className={cn("mb-4", className)}>
      <label className="block text-sm font-medium mb-1">
        {label}
        {description && (
          <span className="text-xs text-muted-foreground ml-2">
            {description}
          </span>
        )}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={palette[variable]}
          onChange={(e) => handleChange(e.target.value)}
          className="h-10 w-10 cursor-pointer rounded border"
          aria-label={`Color picker for ${label}`}
        />
        <input
          type="text"
          value={palette[variable]}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md text-sm"
          aria-label={`Hex value for ${label}`}
        />
      </div>
    </div>
  );
};
