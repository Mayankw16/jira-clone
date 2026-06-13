import { Loader } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)]">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};

export default LoadingPage;
