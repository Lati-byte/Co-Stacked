// src/components/shared/Dialog.jsx
import styles from './Dialog.module.css';
import { motion, AnimatePresence } from 'framer-motion';

export const Dialog = ({ open, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className={styles.dialog}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} // Prevents clicks inside dialog from closing it
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};