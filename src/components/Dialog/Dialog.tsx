import { ReactNode, useEffect, useRef } from 'react';
import { css, cx } from '~styled-system/css';

interface DialogProps {
  children: ReactNode;
  className?: string;
  open?: boolean;
  onClose?: () => void;
}

const cssDialog = css({
  border: 'none',
  '&::backdrop': {
    background: 'rgba(0, 0, 0, 0.5)',
  },
});

export default function Dialog({ children, open, onClose, className }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose?.();
    };

    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={cx(cssDialog, className)}
      onClick={handleBackdropClick}
    >
      {children}
    </dialog>
  );
}
