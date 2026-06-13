import { useMedia } from "react-use";

import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "./ui/drawer";

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleForSR: string;
}

export const ResponsiveModal = ({
  children,
  open,
  onOpenChange,
  titleForSR,
}: ResponsiveModalProps) => {
  const isDesktop = useMedia("(min-width: 1024px)", true);

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTitle className="sr-only">{titleForSR}</DialogTitle>
        <DialogContent className=" lg:max-w-xl p-0 border-none overflow-y-auto max-h-[85vh] hide-scrollbar">
          {children}
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerTitle className="sr-only">{titleForSR}</DrawerTitle>
        <div className="overflow-y-auto max-h-[85vh] hide-scrollbar">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
