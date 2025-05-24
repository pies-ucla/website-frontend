import React from 'react';
import styles from './StaticModal.module.css';

interface StaticModalCardProps {
  children: React.ReactNode;
}

const StaticModalCard: React.FC<StaticModalCardProps> = ({ children }) => {
  return (
    <div className={styles.staticModalCard}>
      <div className={styles.staticModalInner}>
        {children}
      </div>
    </div>
  );
};

export default StaticModalCard;
