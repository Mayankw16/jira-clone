import { Loader } from "lucide-react";

export const DashboardLoader = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-168px)]">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};
