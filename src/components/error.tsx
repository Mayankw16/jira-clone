import { AlertTriangle } from "lucide-react";

interface ErrorProps {
  message?: string;
}

export const Error = ({ message = "Something went wrong" }: ErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-152px)]">
      <AlertTriangle className="size-20 text-muted-foreground mb-2" />
      <p className="font-medium text-muted-foreground">{message}</p>
    </div>
  );
};
