import { ResponsiveModal } from "@/components/responsive-modal";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export const useConfirm = (
  title: string,
  message: string,
  variant: ButtonProps["variant"] = "primary",
) => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise<boolean>((resolve) => setPromise({ resolve }));

  const handleClose = () => setPromise(null);

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <ResponsiveModal
      open={!!promise}
      onOpenChange={handleClose}
      titleForSR={title}
    >
      <Card className="w-full h-full border-none shadow-none">
        <CardContent>
          <CardHeader className="pl-3">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <div className="pt-4 w-full flex flex-col gap-y-2 sm:flex-row gap-x-2 items-center justify-end">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant={variant}
              className="w-full sm:w-auto"
            >
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );

  return [ConfirmationDialog, confirm];
};
