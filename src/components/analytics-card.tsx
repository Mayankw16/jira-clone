import { FaCaretDown, FaCaretUp } from "react-icons/fa";

import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: number;
  difference: number;
}

export const AnalyticsCard = ({
  title,
  value,
  difference,
}: AnalyticsCardProps) => {
  const iconColor = difference > 0 ? "text-emerald-500" : "text-red-500";
  const increaseValueColor = iconColor;

  const Icon = difference > 0 ? FaCaretUp : FaCaretDown;

  return (
    <Card className="ring-0 shadow-none w-56">
      <CardHeader>
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="font-medium">
            <span className="truncate text-base">{title}</span>
          </CardDescription>
          <div className="flex items-center gap-x-1">
            <Icon className={cn(iconColor, "size-4")} />
            <span
              className={cn(
                increaseValueColor,
                "truncate text-base font-medium",
              )}
            >
              {difference}
            </span>
          </div>
        </div>
        <CardTitle className="3xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
};
