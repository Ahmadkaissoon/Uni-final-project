import { useRef, useState } from "react";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectEmpty,
  MultiSelectList,
  MultiSelectSearch,
  MultiSelectTrigger,
  MultiSelectValue,
  renderMultiSelectOptions,
  type MultiSelectOption,
  type MultiSelectOptionGroup,
} from "@/components/global/ui/multi-select";
import { cn } from "@/utils/cn";

type Option = { value: string; label: string; group?: string };

type Props = {
  options: Option[];
  loadingMessage: string;
  noResultsMessage: string;
  placeholder: string;
  onSelect?: (value: string) => void;
  onDeselect?: (value: string) => void;
  onValuesChange?: (values: string[]) => void;
  values?: string[];
  icon?: React.ElementType;
  triggerClassName?: string;
};

const groupOptions = (options: Option[]): MultiSelectOptionGroup[] => {
  return options.reduce((acc, item) => {
    const group = acc.find((g) => g.heading === item.group);
    if (group) {
      group.children.push(item);
    } else {
      acc.push({ heading: item.group, children: [item] });
    }
    return acc;
  }, [] as MultiSelectOptionGroup[]);
};

const search = async (
  keyword: string | undefined,
  allOptions: Option[]
): Promise<MultiSelectOptionGroup[]> => {
  if (!keyword) return groupOptions(allOptions);
  await new Promise((resolve) => setTimeout(resolve, 500));
  const lowerKeyword = keyword.toLowerCase();
  const filtered = allOptions.filter((item) =>
    item.label.toLowerCase().includes(lowerKeyword)
  );
  return groupOptions(filtered);
};

const MultipleSelection = ({
  options: initialOptions,
  loadingMessage,
  noResultsMessage,
  placeholder,
  onSelect = () => {},
  onDeselect = () => {},
  values = [],
  onValuesChange = () => {},
  icon: Icon,
  triggerClassName,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<MultiSelectOption[]>(() =>
    groupOptions(initialOptions)
  );
  const indexRef = useRef(0);

  const handleSearch = async (keyword: string) => {
    const index = ++indexRef.current;
    setLoading(true);
    const newOptions = await search(keyword, initialOptions);
    if (indexRef.current === index) {
      setOptions(newOptions);
      setLoading(false);
    }
  };

  return (
    <MultiSelect
      onSearch={handleSearch}
      value={values}
      onSelect={onSelect}
      onDeselect={onDeselect}
      onValueChange={onValuesChange}
    >
      <MultiSelectTrigger
        showTrigger
        className={cn(Icon && "justify-start gap-2", triggerClassName)}
      >
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
        <MultiSelectValue placeholder={placeholder} />
      </MultiSelectTrigger>
      <MultiSelectContent className="bg-white rounded-xs">
        <MultiSelectSearch />
        <MultiSelectList>
          {loading ? null : renderMultiSelectOptions(options)}
          <MultiSelectEmpty>
            {loading ? loadingMessage : noResultsMessage}
          </MultiSelectEmpty>
        </MultiSelectList>
      </MultiSelectContent>
    </MultiSelect>
  );
};

export default MultipleSelection;
