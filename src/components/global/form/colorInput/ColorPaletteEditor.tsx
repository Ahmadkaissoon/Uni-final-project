"use client";

import { useAtom } from "jotai";
import { colorPaletteAtom, defaultColorPalette } from "@/stores/colorPalett";
import { ColorInput } from "./ColorInput";
import { Button } from "../button/Button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { PiPaletteBold } from "react-icons/pi";

export const ColorPaletteEditor = () => {
  const [palette, setPalette] = useAtom(colorPaletteAtom);
  const [openPalette, setOpenPalette] = useState(false);

  // Apply colors to CSS variables on mount
  useEffect(() => {
    Object.entries(palette).forEach(([key, value]) => {
      document.documentElement.style.setProperty(
        `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
        value
      );
    });
  }, [palette]);

  const handleReset = () => {
    setPalette(defaultColorPalette);
    toast.success("تم إعادة تعيين الألوان إلى الإعدادات الافتراضية");

    // Apply default colors to CSS variables
    Object.entries(defaultColorPalette).forEach(([key, value]) => {
      document.documentElement.style.setProperty(
        `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
        value
      );
    });
  };

  return (
    <>
      {/* Floating palette button */}
      <div
        onClick={() => setOpenPalette((prev) => !prev)}
        className="fixed z-[10000] flex cursor-pointer justify-center items-center bottom-[30px] left-[30px] size-[50px] rounded-full border border-primary-border bg-primary text-inverse-fg"
        aria-label="فتح محرر الألوان"
      >
        <PiPaletteBold size={24} />
      </div>

      {/* Color editor panel */}
      {openPalette && (
        <div
          className="container fixed z-[10000] bottom-[100px] left-[30px] h-[70svh] w-[30vw] min-w-[300px] overflow-auto bg-tertiary-bg shadow-lg border border-primary-border rounded-2xl p-8"
          dir="rtl"
        >
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">محرر ألوان الموقع</h2>
              <Button
                variant="destructive"
                onClick={handleReset}
                className="px-[20px]"
              >
                إعادة التعيين
              </Button>
            </div>

            {/* Color groups */}
            <div className="flex flex-col">
              {/* Brand Colors */}
              <div>
                <h3 className="font-medium mb-4 text-lg">الألوان الأساسية</h3>
                <ColorInput
                  label="اللون الأساسي"
                  variable="primary"
                  description=" اللون الرئيسي للعلامة التجارية"
                />
                <ColorInput
                  label="اللون الثانوي"
                  variable="secondary"
                  description=" لون التمييز"
                />
              </div>

              {/* Backgrounds */}
              <div>
                <h3 className="font-medium mb-4 text-lg">ألوان الخلفيات</h3>
                <ColorInput label="الخلفية الأساسية" variable="primaryBg" />
                <ColorInput label="الخلفية الثانوية" variable="secondaryBg" />
                <ColorInput label="الخلفية الثالثية" variable="tertiaryBg" />
                <ColorInput label="الخلفية الرابعة" variable="quaternaryBg" />
              </div>

              {/* Text Colors */}
              <div>
                <h3 className="font-medium mb-4 text-lg">ألوان النصوص</h3>
                <ColorInput label="النص الأساسي" variable="primaryFg" />
                <ColorInput label="النص الثانوي" variable="secondaryFg" />
                <ColorInput label="النص الرابع" variable="quaternaryFg" />
                <ColorInput label="النص المعكوس" variable="inverseFg" />
                <ColorInput label="العناوين الرئيسية" variable="headerFg" />
              </div>

              {/* Status Colors */}
              <div>
                <h3 className="font-medium mb-4 text-lg">ألوان الحالات</h3>
                <ColorInput
                  label="النجاح"
                  variable="success"
                  description=" للإجراءات الإيجابية"
                />
                <ColorInput
                  label="خطأ"
                  variable="error"
                  description=" للأخطاء والتحذيرات"
                />
              </div>

              {/* Borders */}
              <div>
                <h3 className="font-medium mb-4 text-lg">ألوان الحدود</h3>
                <ColorInput label="الحد الأساسي" variable="primaryBorder" />
                <ColorInput label="الحد الثانوي" variable="secondaryBorder" />
                <ColorInput label="الحد الثالثي" variable="tertiaryBorder" />
              </div>

              {/* Inputs */}
              <div>
                <h3 className="font-medium mb-4 text-lg">حقول الإدخال</h3>
                <ColorInput label="خلفية الحقول" variable="inputBg" />
                <ColorInput label="نص العنصر النائب" variable="placeholder" />
              </div>

              {/* Popup */}
              <div>
                <h3 className="font-medium mb-4 text-lg">النوافذ المنبثقة</h3>
                <ColorInput label="تعتيم الخلفية" variable="primaryOverlay" />
                <ColorInput label="خلفية النافذة" variable="popupBg" />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t flex justify-start">
              <Button
                variant="outline"
                className="px-[30px]"
                onClick={async () => {
                  const colorsJson = JSON.stringify(palette, null, 2);
                  await navigator?.clipboard?.writeText(colorsJson);
                  toast.info("تم نسخ الألوان إلى الحافظة");
                }}
              >
                نسخ الألوان (JSON)
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
