import type { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface FadeModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  footer: ReactNode;
  onClose: () => void;
  mobileLayout?: 'fullscreen' | 'compact';
}

export function FadeModal({
  isOpen,
  title,
  description,
  children,
  footer,
  onClose,
  mobileLayout = 'fullscreen',
}: FadeModalProps) {
  const mobileContentClassName =
    mobileLayout === 'compact'
      ? 'top-1/2 left-1/2 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-none -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl p-4'
      : 'inset-0 top-0 left-0 h-dvh max-w-none -translate-x-0 -translate-y-0 overflow-y-auto rounded-none p-4';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`${mobileContentClassName} sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:p-6`}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        <div className="grid gap-4">{children}</div>

        <DialogFooter className="mt-2 !-mx-0 !-mb-0 !justify-end !border-0 !bg-transparent !p-0">
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
