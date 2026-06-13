"use client";

import { Loader, LogOut } from "lucide-react";
import { useLogout } from "../api/use-logout";
import { useUser } from "../api/use-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DottedSeparator } from "@/components/dotted-seperator";

export const UserButton = () => {
  const { mutate: logout } = useLogout();
  const { data: user, isLoading } = useUser();

  if (isLoading)
    return (
      <div className="flex items-center justify-center size-10 rounded-full bg-neutral-200 border border-neutral-300">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );

  if (!user) return null;

  const { name, email } = user;

  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : (email.charAt(0).toUpperCase() ?? "U");

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className="outline-none">
        <Avatar className="size-10 hover:opacity-80 transition border border-neutral-300">
          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex items-center justify-center flex-col gap-2 py-4 px-2.5">
          <Avatar className="size-13 border border-neutral-300">
            <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center justify-center flex-col">
            <p className="text-sm font-medium text-neutral-900">
              {name || "User"}
            </p>
            <p className="text-xs text-neutral-500">{email}</p>
          </div>
        </div>
        <DottedSeparator className="mb-1" />
        <DropdownMenuItem
          onClick={() => logout()}
          className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
        >
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
