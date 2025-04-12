import React from 'react'; 
import { motion } from 'framer-motion';
import styles from './QuickLinks.module.css';

const QuickLinks: React.FC = () => {
  return (
    <motion.div 
      className={styles.quickLinksSection}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h1 className={styles.quickLinksHeader}>Quick Links</h1>
    </motion.div>
  );
};

// Make sure this is properly exported
export default QuickLinks;
