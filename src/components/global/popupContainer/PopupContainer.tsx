import { motion } from "framer-motion";
import type { ReactNode, MouseEvent, Dispatch } from "react";

interface PopupContainerProps {
  setIsOpen: Dispatch<React.SetStateAction<number | null | boolean>>;
  children: ReactNode;
  addingStyle?: string;
}

function PopupContainer({
  setIsOpen,
  children,
  addingStyle = "",
}: PopupContainerProps) {
  const handleParentClick = (event: MouseEvent<HTMLDivElement>) => {
    // Prevent click events from children to bubble up to the parent
    if (event.target === event.currentTarget) {
      setIsOpen(null);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.2 }}
        className={`fixed w-[100vw] h-[100svh] bg-primary-overlay z-[30] backdrop-blur-[30px] top-0 right-0 ${addingStyle}`}
        onClick={handleParentClick}
      >
        {children}
      </motion.div>
    </>
  );
}

export default PopupContainer;
