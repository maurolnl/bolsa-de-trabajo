import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { Input } from "./input";

export interface SearchableSelectOption {
  label: string;
  value: string;
}

interface SearchableSelectProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "value" | "onChange" | "type"
  > {
  options: SearchableSelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
}

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[_/]/g, " ")
    .toLowerCase();

export const SearchableSelect = React.forwardRef<
  HTMLButtonElement,
  SearchableSelectProps
>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = "Seleccione una opción",
      searchPlaceholder = "Buscar...",
      emptyMessage = "No se encontraron resultados.",
      className,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");

    const selectedOption = options.find((option) => option.value === value);

    const filteredOptions = React.useMemo(() => {
      const terms = normalize(searchTerm).split(/\s+/).filter(Boolean);
      if (terms.length === 0) return options;
      return options.filter((option) => {
        const label = normalize(option.label);
        return terms.every((term) => label.includes(term));
      });
    }, [options, searchTerm]);

    const close = () => {
      setIsOpen(false);
      setSearchTerm("");
    };

    const selectOption = (optionValue: string) => {
      onValueChange(optionValue);
      close();
    };

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (filteredOptions.length > 0) {
          selectOption(filteredOptions[0].value);
        }
      } else if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    return (
      <div className="relative">
        <button
          {...props}
          ref={ref}
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          disabled={disabled}
          onClick={() => (isOpen ? close() : setIsOpen(true))}
          className={cn(
            "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <span
            className={cn(
              "line-clamp-1 text-left",
              !selectedOption && "text-muted-foreground"
            )}
          >
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={close} />
            <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
              <Input
                autoFocus
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="h-8 rounded-sm px-2 py-1 text-sm"
              />
              <div role="listbox" className="mt-1 max-h-64 overflow-auto">
                {filteredOptions.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm hover:bg-accent hover:text-accent-foreground"
                      onClick={() => selectOption(option.value)}
                    >
                      {option.label}
                      {isSelected && (
                        <CheckIcon className="absolute right-2 h-4 w-4" />
                      )}
                    </div>
                  );
                })}
                {filteredOptions.length === 0 && (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    {emptyMessage}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);

SearchableSelect.displayName = "SearchableSelect";
