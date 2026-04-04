import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/global/ui/shadcs-drawer";
import { useModal } from "@/hooks/global/use-modal";
import { type UseQueryResult } from "@tanstack/react-query";
import { X } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import StatusManager from "../statusManager/StatusManager";
import SideModalEditableHeader from "./side-modal-editable-header";
import { StatusManagerSkeleton } from "./side-modal-header-skeleton";

interface SideModalProps {
  id: string;
  title: string;
  description?: string | React.ReactNode;
  children: React.ReactNode;
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "full";
  shouldCloseOnOverlayClick?: boolean;
  headerClassName?: string;
  besideHeader?: ReactNode;
  onClose?: () => void;
  handleChangeName?: (key: string, value: unknown) => void;
  query?: UseQueryResult;
  disabled?: boolean;
}

export function SideModal({
  id,
  title,
  children,
  description,
  size = "md",
  shouldCloseOnOverlayClick = false,
  headerClassName,
  besideHeader,
  onClose,
  handleChangeName,
  disabled,
  query,
}: SideModalProps) {
  const { closeModal, openModals } = useModal();
  const isOpen = openModals.includes(id);
  const modalIndex = openModals.indexOf(id);
  const isTopModal = modalIndex === openModals.length - 1;
  const side = "left";

  // Calculate how many modals are after this one in the stack
  const modalsAfter = openModals.length - modalIndex - 1;

  // Base offset amount (adjust this value to change push distance)
  const baseOffset = 40; // pixels

  // Calculate total offset based on position in stack
  const totalOffset = modalsAfter * baseOffset;

  // Apply transform based on drawer side
  const transformValue =
    totalOffset > 0
      ? side === "left"
        ? `translateX(${totalOffset}px)`
        : side === "top"
        ? `translateY(${totalOffset}px)`
        : `translateY(-${totalOffset}px)`
      : "translateX(0)";

  // Close on escape key (only for top modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && isTopModal) {
        onClose?.();
        closeModal(id);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, id, closeModal, isTopModal, onClose]);

  const sizeClasses = {
    xs: "max-w-[320px]",
    sm: "max-w-[384px]",
    md: "max-w-[448px]",
    lg: "max-w-[512px]",
    xl: "max-w-[576px]",
    "2xl": "max-w-[672px]",
    "3xl": "max-w-[768px]",
    "4xl": "max-w-[896px]",
    "5xl": "max-w-[1024px]",
    "6xl": "max-w-[1152px]",
    "7xl": "max-w-[1280px]",
    "8xl": "max-w-[1536px]",
    full: "max-w-[100%]",
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose?.();
          closeModal(id);
        }
      }}
      direction={side}
    >
      <DrawerContent
        className={`w-full ${sizeClasses[size]} rounded-none h-[calc(100%)] shadow-2xl !border-0 flex flex-col bg-tertiary-bg text-primary-fg`}
        style={{
          transform: transformValue,
          transition: "transform 0.3s ease-out",
          zIndex: 10 + modalIndex,
          pointerEvents: "all",
          // marginTop: "64px",
        }}
        onInteractOutside={(e) => {
          if (!shouldCloseOnOverlayClick || !isTopModal) {
            e.preventDefault();
          }
        }}
      >
        <DrawerHeader
          style={{ direction: "rtl" }}
          className={`flex flex-col !gap-[10px] items-start relative px-[24px] py-[14px] border-b border-solid !border-border ${headerClassName}`}
        >
          <DrawerTitle className="text-[24px] w-full font-medium flex items-start gap-[32px]">
            <StatusManager Loader={StatusManagerSkeleton} query={query}>
              {handleChangeName ? (
                <SideModalEditableHeader
                  disabled={disabled}
                  handleChangeName={handleChangeName}
                  title={title}
                />
              ) : (
                <div className="flex-1 text-start">{title}</div>
              )}
              {besideHeader ? besideHeader : null}
            </StatusManager>
          </DrawerTitle>
          <DrawerDescription className={`hidden`}>{null}</DrawerDescription>
          <div className={`${!description ? "hidden" : "block"}`}>
            {description}
          </div>
          <DrawerClose className="group cursor-pointer absolute top-[16px] start-[-13px] rounded-full bg-tertiary-bg border border-solid border-border p-[2px] focus:outline-none">
            <X className="size-[20px] text-secondary-fg group-hover:text-primary-fg transition-colors duration-[0.3s]" />
          </DrawerClose>
        </DrawerHeader>
        <div
          className="[&:has(*.no-padding)]:!p-0 flex-1 w-full p-[24px] pt-[20px] overflow-auto z-10"
          dir="rtl"
        >
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
