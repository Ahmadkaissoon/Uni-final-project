import { FaArrowCircleLeft } from "react-icons/fa";
import { Button } from "./Button";
import type { ReactNode } from "react";
interface NextButtonProps {
  id: string;
  title?: string;
  icon?: ReactNode;
  disabled?: boolean;
}
const NextButton = ({
  id,
  title = "التالي",
  icon = <FaArrowCircleLeft />,
  disabled,
}: NextButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={disabled}
      className="!h-[40px] min-w-[130px]"
      id={id}
    >
      <span>{title}</span>
      <span className="w-[30px] h-[30px] flex justify-center items-center">
        {icon}
      </span>
    </Button>
  );
};

export default NextButton;
