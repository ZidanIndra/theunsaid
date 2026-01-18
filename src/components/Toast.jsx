import { AnimatePresence, motion } from "framer-motion";

export default function Toast({ message, onClose }) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: -16 }}
          animate={{
            opacity: 1,
            y: 0,
            x: [0, -6, 6, -4, 4, 0]
          }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4 }}
          className="fixed top-6 left-1/2 z-50 w-[min(90vw,420px)] -translate-x-1/2 rounded-2xl border border-rose-400/30 bg-zinc-950/90 px-4 py-3 text-sm text-rose-100 shadow-xl"
          onClick={onClose}
          role="alert"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
