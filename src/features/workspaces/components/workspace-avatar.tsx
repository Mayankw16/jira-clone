import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface WorkspaceAvatarProps {
  image?: string;
  name: string;
  classname?: string;
}

export const WorkspaceAvatar = ({
  image,
  name,
  classname,
}: WorkspaceAvatarProps) => {
  if (image)
    return (
      <Avatar className={cn("size-10", classname)}>
        <AvatarImage src={image} alt={name} className="rounded-md" />
      </Avatar>
    );

  return (
    <Avatar className={cn("size-10", classname)}>
      <AvatarFallback className="text-white bg-blue-600 font-semibold text-lg uppercase rounded-md">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
};
