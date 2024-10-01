import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Minus, Plus } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const NumberField = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value:defaultValue,...props }, ref) => {
    const [value, setValue] = React.useState<number>(
      parseInt(defaultValue as string) || 0
    );

    const handleIncrement = () => {
      console.log("incrementing",value);
      setValue((prevValue) => prevValue + 1);
    };

    const handleDecrement = () => {
      setValue((prevValue) => prevValue - 1);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(event.target.value, 10);
      if (!isNaN(newValue)) {
        setValue(newValue);
      }
    };
    return (
      <div className="relative">
        <Button
          onClick={handleIncrement}
          type="button"
          variant={"ghost"}
          size={"icon"}
          className="absolute right-2 w-8 h-8 top-1"
        >
          <Plus size={16} />
        </Button>
        <input
          type={"number"}
          onChange={handleChange}
          inputMode="decimal"
          value={value}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm text-center ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        <Button
          variant={"ghost"}
          type="button"
          onClick={handleDecrement}
          size={"icon"}
          className="absolute left-2 w-8 h-8  top-1"
        >
          <Minus size={16} />
        </Button>
      </div>
    );
  }
);

NumberField.displayName = "NumberField";

export { NumberField };
