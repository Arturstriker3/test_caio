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
}

export function FadeModal({
  isOpen,
  title,
  description,
  children,
  footer,
  onClose,
}: FadeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
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
