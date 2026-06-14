import { StandaloneNavbar } from "@/components/standalone-navbar";

interface StandloneLayoutProps {
  children: React.ReactNode;
}

const StandloneLayout = ({ children }: StandloneLayoutProps) => {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        <StandaloneNavbar />
        <div className="flex flex-col items-center justify-center py-8 pt-26">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandloneLayout;
