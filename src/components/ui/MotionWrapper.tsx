import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useEffect } from "react";

interface MotionWrapperProp {
  children: React.ReactNode;
  open: boolean;
  className: string;
  duration?: number;
  onClose?: () => void;
}

function MotionWrapper({
  children,
  open,
  className,
  duration,
  onClose,
}: MotionWrapperProp) {
  useEffect(() => {
    if (open && duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          key="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 w-full h-[100vh] flex items-center justify-center bg-[#3e3e3e95] z-[999]"
          onClick={onClose}
        >
          <motion.div
            key="modal-content"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className={`${className}`}
            onClick={(e: any) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MotionWrapper;
