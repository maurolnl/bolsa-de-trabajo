import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface AutocompleteInputProps {
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  addButtonLabel?: string;
}

export const AutocompleteInput = ({
  value = [],
  onChange,
  placeholder = "Escriba el texto",
  addButtonLabel = "Agregar",
}: AutocompleteInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const addItem = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue]);
      setInputValue("");
    }
  };

  const removeItem = (itemToRemove: string) => {
    onChange(value.filter((item) => item !== itemToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      addItem();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addItem}
          disabled={!inputValue.trim()}
          size="sm"
        >
          <Plus className="h-3 w-3" />
          {addButtonLabel}
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {item}
              <button
                type="button"
                onClick={() => removeItem(item)}
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
