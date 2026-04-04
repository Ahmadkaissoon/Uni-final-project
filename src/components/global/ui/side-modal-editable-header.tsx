import { useState } from "react";

interface SideModalEditableHeaderProps {
  handleChangeName: (key: string, value: string) => void;
  title: string;
  disabled?: boolean;
}
function SideModalEditableHeader({
  handleChangeName,
  title,
  disabled,
}: SideModalEditableHeaderProps) {
  // manage value of editable title
  const [value, setValue] = useState(title);

  return (
    <input
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        if (value) handleChangeName("name", value);
        else setValue(title);
      }}
      disabled={disabled}
      value={value}
      className="!border-none flex-1 text-start !outline-0 !border-0 focus-visible:!outline-0 focus-visible:!border-0 !p-[2px] !h-max !bg-transparent !rounded-[5px] hover:!bg-input-hover"
    />
  );
}

export default SideModalEditableHeader;
