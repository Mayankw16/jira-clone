import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const ProjectAvatar = ({
  image,
  name,
  className,
  fallbackClassName,
}: ProjectAvatarProps) => {
  if (image)
    return (
      <Avatar className={cn("size-6", className)}>
        <AvatarImage src={image} alt={name} className="rounded" />
      </Avatar>
    );

  return (
    <Avatar className={cn("size-6", className)}>
      <AvatarFallback
        className={cn(
          "text-white bg-blue-600 font-semibold text-sm uppercase rounded-md",
          fallbackClassName,
        )}
      >
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
};
