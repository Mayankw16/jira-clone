import Image from "next/image";
import Link from "next/link";
import { Navigation } from "./navigation";
import { DottedSeparator } from "./dotted-seperator";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Projects } from "./projects";

export const Sidebar = () => {
  return (
    <aside className="h-full w-full p-4 bg-neutral-100">
      <Link href="/" className="flex items-center justify-center w-full">
        <Image priority src="/logo.svg" alt="logo" width={80} height={31} />
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Projects />
    </aside>
  );
};
