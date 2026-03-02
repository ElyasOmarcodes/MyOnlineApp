import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff } from 'lucide-react';

interface NetworkDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const NetworkDialog: React.FC<NetworkDialogProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[32px] p-6 shadow-2xl border border-zinc-100 dark:border-zinc-800"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-2">
                <WifiOff size={32} />
              </div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                انټرنیټ نشته
              </h3>
              <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                مهرباني وکړئ د دې عمل ترسره کولو لپاره خپل انټرنیټ وصل کړئ او بیا هڅه وکړئ.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl font-bold active:scale-95 transition-transform mt-4"
              >
                سمه ده
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NetworkDialog;
