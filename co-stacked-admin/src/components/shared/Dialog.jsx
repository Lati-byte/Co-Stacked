import styles from './Dialog.module.css';
import { AnimatePresence, motion } from 'framer-motion';
export const Dialog = ({ open, onClose, children }) => (
  <AnimatePresence>
    {open && (
      <motion.div className={styles.backdrop} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className={styles.dialog} onClick={e => e.stopPropagation()} initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }}>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);