"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (data: Date) => void;
  className?: string;
  placeholder?: string;
  triggerId?: string;
}

export const DatePicker = ({
  value,
  onChange,
  className,
  placeholder = "Select date",
  triggerId,
}: DatePickerProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        id={triggerId}
        variant="outline"
        size="lg"
        className={cn(
          "w-full justify-start text-left font-normal px-3 shadow-2xs",
          !value && "text-muted-foreground",
          className,
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value ? format(value, "PPP") : <span>{placeholder}</span>}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0">
      <Calendar
        mode="single"
        selected={value}
        onSelect={(date) => onChange(date as Date)}
      />
    </PopoverContent>
  </Popover>
);
