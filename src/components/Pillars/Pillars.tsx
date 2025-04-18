'use client';

import { useState } from 'react';
import styles from './Pillars.module.css';
import Modal from '../Modal/Modal';

interface PillarProps {
  text: string;
  isActive?: boolean;
  onClick?: () => void;
}

const Pillar: React.FC<PillarProps> = ({ text, isActive = false, onClick }) => {
  const chars = text.split('');
  return (
    <div 
      className={`${styles.pillar} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      {chars.map((char, index) => (
        <div key={index} className={styles.pillarChar}>
          {char}
        </div>
      ))}
    </div>
  );
};

const NavButton: React.FC<{ direction: 'left' | 'right', onClick: () => void }> = ({ direction, onClick }) => {
  return (
    <div className={styles.navigationButton} onClick={onClick}>
      {direction === 'left' ? '←' : '→'}
    </div>
  );
};

const Pillars: React.FC = () => {
  const pillars = ['PILIPINOS', 'INNOVATION', 'EDUCATION', 'SOCIALS'];
  // FIX LATER
  const pillarContent = [
    'We are Filipino. We are one.',
    'We envision a general membership that flourishes from the ability to create ideas and turn them into reality. PIES intends on giving each student the opportunity to further their talents as much as possible, STEM-related or otherwise.',
    'We are education. We are one.',
    'We are social. We are one.',
  ]
  const [activeIndex, setActiveIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handlePrevClick = () => {
    setActiveIndex((prev) => (prev === 0 ? pillars.length - 1 : prev - 1));
  };

  const handleNextClick = () => {
    setActiveIndex((prev) => (prev === pillars.length - 1 ? 0 : prev + 1));
  };

  const handleActivePillarClick = () => {
    setIsAnimating(true);
    setShowModal(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  const displayPillars = [
    pillars[(activeIndex - 1 + pillars.length) % pillars.length],
    pillars[activeIndex],
    pillars[(activeIndex + 1) % pillars.length]
  ];

  return (
    <div className={styles.threePillarsContainer}>
      <NavButton direction="left" onClick={handlePrevClick} />
      <div className={styles.pillarsWrapper}>
        {displayPillars.map((text, index) => (
          <Pillar 
            key={text} 
            text={text} 
            isActive={index === 1}
            onClick={index === 1 ? handleActivePillarClick : undefined}
          />
        ))}
      </div>
      <NavButton direction="right" onClick={handleNextClick} />

      {!isAnimating && (
        <div className={styles.clickIndicator}>
          Click to learn more
        </div>
      )}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className={styles.pillarHeading}>{pillars[activeIndex]}</h2>
        <p className={styles.pillarText}>{pillarContent[activeIndex]}</p>
</Modal>
    </div>
  );
};

export default Pillars;
