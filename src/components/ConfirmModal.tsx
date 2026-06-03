import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen:    boolean;
  title:     string;
  message:   string;
  onConfirm: () => void;
  onCancel:  () => void;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1,    opacity: 1 }}
            exit={{   scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-white dark:bg-[#111827]
              border border-[#e2e8f0] dark:border-[#1f2a3d]
              rounded-2xl p-6 w-full max-w-sm
              shadow-xl dark:shadow-[0_20px_60px_rgb(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400">
                <AlertTriangle size={18} />
              </span>
              <h3 className="text-gray-900 dark:text-white font-semibold">{title}</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-[#4b5e7a] mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm border border-[#e2e8f0] dark:border-[#1f2a3d]
                  text-gray-500 dark:text-[#4b5e7a] rounded-lg
                  hover:text-gray-900 dark:hover:text-white
                  hover:bg-gray-50 dark:hover:bg-white/5
                  transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}