import { LoaderIcon } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-152px)]">
      <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};
