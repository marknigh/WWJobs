import React from 'react';
import { Dialog, DialogOverlay, DialogContent } from '@/components/ui/dialog';

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <Dialog isOpen={isOpen} onDismiss={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black opacity-50" />
      <DialogContent className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded-md shadow-md">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
