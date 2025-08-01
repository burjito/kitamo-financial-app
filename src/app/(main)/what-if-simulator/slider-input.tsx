"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SliderInputProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  max: number;
  min: number;
  step: number;
  prefix?: string;
  suffix?: string;
}

export function SliderInput({ label, value, onValueChange, max, min, step, prefix, suffix }: SliderInputProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor={label.toLowerCase().replace(" ", "-")}>{label}</Label>
      <div className="flex items-center space-x-2">
        {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
        <Input
          id={label.toLowerCase().replace(" ", "-")}
          type="number"
          value={value}
          onChange={(e) => onValueChange(Number(e.target.value))}
          className="flex-1"
          min={min}
          max={max}
          step={step}
        />
        {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
      </div>
      <Slider
        value={[value]}
        onValueChange={(val) => onValueChange(val[0])}
        max={max}
        min={min}
        step={step}
        className="w-full"
      />
    </div>
  );
}
