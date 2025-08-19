import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const CenteredModal = DialogPrimitive.Root;
export const CenteredModalTrigger = DialogPrimitive.Trigger;

export const CenteredModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-12 shadow-2xl border border-[#800000] focus:outline-none",
        className
      )}
      {...props}
    >
      <div className="w-full flex flex-col items-center">
        {children}
      </div>
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full bg-[#FFD700] p-1 text-[#800000] shadow-md opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2">
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
CenteredModalContent.displayName = "CenteredModalContent";
