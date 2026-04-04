import { Fragment, useState, type ReactNode } from "react";
import { FaXmark } from "react-icons/fa6";
import Modal from "./Modal";
import { IoInformationCircleOutline } from "react-icons/io5";

/**
 * Props for the Info component
 * @property {string | ReactNode} info - The content to display in the info popup
 */
interface InfoProps {
  info: string | ReactNode;
  className?: string;
}

/**
 * Info Component
 *
 * A clickable information icon that reveals additional content in a modal popup.
 * Useful for displaying help text, descriptions, or supplementary information.
 *
 * Features:
 * - Clickable info icon that opens a modal
 * - Modal with close button and scrollable content
 * - Supports both string and ReactNode content
 * - Responsive sizing
 * - Smooth transitions
 */
function Info({ info, className }: InfoProps) {
  // State to control modal visibility
  const [isOpenInof, setIsOpenInfo] = useState<boolean | null | number>(false);

  return (
    <Fragment>
      {/* Information icon trigger */}
      <IoInformationCircleOutline
        onClick={() => setIsOpenInfo(true)}
        className={`cursor-pointer text-primary-fg self-end size-[24px] min-w-[24px] ${className}`}
        aria-label="Show information"
      />

      {/* Modal dialog */}
      <Modal isOpen={isOpenInof} setIsOpen={setIsOpenInfo}>
        <div className="md:min-w-[40vw] w-full min-h-[40svh] max-h-[80svh] flex flex-col gap-lg">
          {/* Modal header with close button */}
          <div className="py-lg px-4xl flex justify-end border-b border-border">
            <FaXmark
              onClick={() => setIsOpenInfo(false)}
              className="text-primary-icon cursor-pointer hover:text-primary-fg transition-all duration-[0.3s]"
              aria-label="Close information"
            />
          </div>

          {/* Scrollable content area */}
          <div className="px-4xl overflow-y-auto font-normal text-size18 text-start whitespace-pre-wrap break-words">
            {info}
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}

export default Info;
