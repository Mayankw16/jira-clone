import Image from "next/image";
import Link from "next/link";

import { UserButton } from "@/features/auth/components/user-button";

interface StandloneLayoutProps {
  children: React.ReactNode;
}

const StandloneLayout = ({ children }: StandloneLayoutProps) => {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        <nav className="flex justify-between items-center h-18">
          <Link href="/">
            <Image src="/logo.svg" alt="Logo" width={80} height={31} />
          </Link>
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center py-8">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandloneLayout;
