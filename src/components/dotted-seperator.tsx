import { cn } from "@/lib/utils";

interface DottedSeparatorProps {
  className?: string;
  color?: string;
  dotSize?: string;
  gapSize?: string;
  direction?: "horizontal" | "vertical";
}

export const DottedSeparator = ({
  className,
  color = "#d4d4d8",
  dotSize = "2px",
  gapSize = "4px",
  direction = "horizontal",
}: DottedSeparatorProps) => {
  const isHorizontal = direction === "horizontal";

  return (
    <div
      className={cn(isHorizontal ? "w-full" : "h-full", className)}
      style={{
        width: isHorizontal ? "100%" : dotSize,
        height: isHorizontal ? dotSize : "100%",
        backgroundImage: `radial-gradient(circle closest-side, ${color} 98%, transparent 98%)`,
        backgroundSize: isHorizontal
          ? `calc(${dotSize} + ${gapSize}) ${dotSize}`
          : `${dotSize} calc(${dotSize} + ${gapSize})`,
        backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
        backgroundPosition: "center",
      }}
    />
  );
};
