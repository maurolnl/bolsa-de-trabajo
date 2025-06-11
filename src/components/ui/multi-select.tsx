import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Input } from "./input";

export interface MultiSelectOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface ChipOptionProps {
  option: MultiSelectOption;
  onRemove: () => void;
}

const ChipOption = ({ option, onRemove }: ChipOptionProps) => {
  const IconComponent = option.icon;
  
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
      {IconComponent && <IconComponent className="h-3 w-3" />}
      {option.label}
      <Cross2Icon 
        className="ml-1 h-3 w-3 hover:text-foreground cursor-pointer" 
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      />
    </span>
  );
};

interface MoreChipProps {
  count: number;
  onClear: () => void;
}

const MoreChip = ({ count, onClear }: MoreChipProps) => {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
      {`+ ${count} más`}
      <Cross2Icon 
        className="ml-1 h-3 w-3 hover:text-foreground cursor-pointer" 
        onClick={(e) => {
          e.stopPropagation();
          onClear();
        }}
      />
    </span>
  );
};

interface SelectOptionsProps {
  options: MultiSelectOption[];
  filteredOptions: MultiSelectOption[];
  selectedValues: string[];
  searchable: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onToggleAll: () => void;
  onToggleOption: (value: string) => void;
}

const SelectOptions = ({
  options,
  filteredOptions,
  selectedValues,
  searchable,
  searchTerm,
  onSearchChange,
  onInputKeyDown,
  onToggleAll,
  onToggleOption,
}: SelectOptionsProps) => {
  return (
    <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover p-0 text-popover-foreground shadow-md">
      <div className="p-1">
        {searchable && (
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={onInputKeyDown}
            className="h-8 rounded-sm px-2 py-1 text-sm"
          />
        )}
        <div className="max-h-64 overflow-auto">
          <div
            className="flex items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
            onClick={onToggleAll}
          >
            <div
              className={cn(
                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                selectedValues.length === options.length
                  ? "bg-primary text-primary-foreground"
                  : "opacity-50 [&_svg]:invisible"
              )}
            >
              <CheckIcon className="h-4 w-4" />
            </div>
            <span>(Seleccionar todos)</span>
          </div>
          {filteredOptions.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <div
                key={option.value}
                className="flex items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                onClick={() => onToggleOption(option.value)}
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <CheckIcon className="h-4 w-4" />
                </div>
                {option.icon && (
                  <option.icon className="mr-2 h-4 w-4 text-muted-foreground hover:text-foreground" />
                )}
                <span>{option.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      {filteredOptions.length === 0 && (
        <div className="py-6 text-center text-sm text-muted-foreground">
          No se encontraron resultados.
        </div>
      )}
    </div>
  );
};

interface MultiSelectProps {
  options: MultiSelectOption[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  value?: string[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxCount?: number;
  searchable?: boolean;
}

export const MultiSelect = React.forwardRef<
  HTMLDivElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      defaultValue = [],
      placeholder = "Select items",
      className,
      disabled = false,
      maxCount = 3,
      searchable = true,
      value,
      ...props
    },
    ref
  ) => {
    const [_value, setSelectedValues] = React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");

    const selectedValues = value || _value;

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (option: string) => {
      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear();
      } else {
        const allValues = options.map((option) => option.value);
        setSelectedValues(allValues);
        onValueChange(allValues);
      }
    };

    const filteredOptions = React.useMemo(() => {
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [options, searchTerm]);

    const hasSelectedValues = selectedValues.length > 0;

    const visibleOptions = selectedValues.slice(0, maxCount);
    const hasMoreOptions = selectedValues.length > maxCount;

    return (
      <div className="relative">
        <div
          ref={ref}
          {...props}
          onClick={handleTogglePopover}
          className={cn(
            "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
            "flex h-auto min-h-9 w-full items-center justify-between px-3 py-2 cursor-default",
            disabled && "pointer-events-none opacity-50",
            className
          )}
        >
          {hasSelectedValues ? (
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-wrap items-center gap-1">
                {visibleOptions.map((value) => {
                  const option = options.find((o) => o.value === value);
                  return option ? (
                    <ChipOption
                      key={value}
                      option={option}
                      onRemove={() => toggleOption(value)}
                    />
                  ) : null;
                })}
                {hasMoreOptions && (
                  <MoreChip
                    count={selectedValues.length - maxCount}
                    onClear={clearExtraOptions}
                  />
                )}
              </div>
              <div className="flex items-center justify-between">
                <Cross2Icon
                  className="h-4 text-muted-foreground hover:text-foreground"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleClear();
                  }}
                />
                <ChevronDownIcon className="h-4 w-4 opacity-50" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full mx-auto">
              <span className="text-sm text-muted-foreground">
                {placeholder}
              </span>
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </div>
          )}
        </div>

        {isPopoverOpen && (
          <SelectOptions
            options={options}
            filteredOptions={filteredOptions}
            selectedValues={selectedValues}
            searchable={searchable}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onInputKeyDown={handleInputKeyDown}
            onToggleAll={toggleAll}
            onToggleOption={toggleOption}
          />
        )}

        {isPopoverOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsPopoverOpen(false)}
          />
        )}
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";
