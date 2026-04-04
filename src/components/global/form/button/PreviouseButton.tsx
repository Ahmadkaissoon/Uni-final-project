import { FaArrowCircleRight } from "react-icons/fa";
import { Button } from "./Button";
import type { Dispatch, SetStateAction } from "react";
interface PreviouseButtonProps {
  title?: string;
  setCurrentStep?: Dispatch<SetStateAction<number>>;
}
const PreviouseButton = ({
  setCurrentStep,
  title = "السابق",
}: PreviouseButtonProps) => {
  return (
    <Button
      className="!h-[40px] min-w-[130px]"
      onClick={(e) => {
        e.preventDefault();
        setCurrentStep?.((prev) => prev - 1);
      }}
    >
      <span className="w-[30px] h-[30px] flex justify-center items-center">
        <FaArrowCircleRight />
      </span>
      <span>{title}</span>
    </Button>
  );
};

export default PreviouseButton;
