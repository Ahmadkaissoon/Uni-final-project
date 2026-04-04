import Loader from "../loader/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";

export interface RefetchLoaderProps {
  isError: boolean | undefined;
  flag: boolean | undefined;
}

/** refetch loader component
 * gets: (isError) refetching of data returns an error or not
 * (flag) is refetching now or not
 */
function RefetchLoader({ isError, flag }: RefetchLoaderProps) {
  // show error timer, used to show error for a second after return the error
  const [showError, setShowError] = useState(false);
  useEffect(() => {
    if (isError) {
      setShowError(true);
      setInterval(() => {
        setShowError(false);
      }, 3000);
    }
  }, [isError]);

  return (
    <AnimatePresence>
      {flag || showError ? (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ ease: "linear", duration: 0.3 }}
          className={`fixed z-[24] flex items-center justify-center bottom-[2px] gap-1 px-2 py-[1px] bg-block-background/50 backdrop-blur-[15px] shadow-sm right-0 w-max text-size12 border-solid ${
            isError ? "border-error" : "border-border"
          }  border border-r-0 text-primary-foreground/70 rounded-l-full`}
        >
          {isError ? (
            // refetch error message
            <>
              حدثت مشكلة في تحديث البيانات <FaXmark className="text-error" />
            </>
          ) : (
            // refetching message and loader
            <>
              جار تحديث البيانات ... <Loader size={3} />
            </>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default RefetchLoader;
