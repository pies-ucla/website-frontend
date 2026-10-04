'use client';

import { useState } from 'react';
import styles from './Pillars.module.css';
import Modal from '../Modal/Modal';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';

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
    <button
      type="button"
      className={`${styles.navigationButton} ${direction === 'left' ? styles.navLeft : styles.navRight}`}
      onClick={onClick}
      aria-label={direction === 'left' ? 'Previous pillar' : 'Next pillar'}
    >
      {direction === 'left' ? <FaArrowLeft /> : <FaArrowRight />}
    </button>
  );
};

const Pillars: React.FC = () => {
  const pillars = ['PILIPINOS', 'INNOVATION', 'EDUCATION', 'SOCIALS'];
  // FIX LATER
  const pillarContent = [
    'We would like to foster a sense of community pride within the membership, sponsoring events which give students a better understanding of the Pilipino culture and history, while at the same time promoting universal respect for all cultures of the world.',

    'We envision a general membership that flourishes from the ability to create ideas and turn them into reality. PIES intends on giving each student the opportunity to further their talents as much as possible, STEM-related or otherwise.',

    'Navigating through the STEM academic system is a very difficult process. PIES offers an environment wherein the student has the support, resources, and confidence to further their education and careers, in and out of the classroom.',

    'In one of the toughest schools in the nation, students often find themselves with little or no time to relax from their studies or meet other people. PIES was created in orderto give students the support they need to face the competitive curriculum ahead of them, and form a close, welcoming community dedicated to being a support system for its general members and to resonate familial values found within Pilipino families and other organizations on campus.',
  ]
  const [activeIndex, setActiveIndex] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const handlePrevClick = () => {
    setActiveIndex((prev) => (prev === 0 ? pillars.length - 1 : prev - 1));
  };

  const handleNextClick = () => {
    setActiveIndex((prev) => (prev === pillars.length - 1 ? 0 : prev + 1));
  };

  const handleActivePillarClick = () => {
    setShowModal(true);
  };

  const displayPillars = [
    pillars[(activeIndex - 1 + pillars.length) % pillars.length],
    pillars[activeIndex],
    pillars[(activeIndex + 1) % pillars.length]
  ];

  return (
    <div className={styles.threePillarsContainer}>
      {/* "hand-drawn" look for the pillars: roughen the edges with noise, then trace an
          ink outline around the wobbly shape. Used via filter: url(#pillar-sketch) */}
      <svg className={styles.sketchFilter} aria-hidden="true">
        <filter id="pillar-sketch" x="-40%" y="-30%" width="180%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" result="wobbly" />
          <feMorphology in="wobbly" operator="dilate" radius="2.5" result="thick" />
          <feFlood floodColor="#1b1b1b" />
          <feComposite in2="thick" operator="in" result="outline" />
          <feMerge>
            <feMergeNode in="outline" />
            <feMergeNode in="wobbly" />
          </feMerge>
        </filter>
      </svg>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className={styles.pillarHeading}>{pillars[activeIndex]}</h2>
        <p className={styles.pillarText}>{pillarContent[activeIndex]}</p>
</Modal>
    </div>
  );
};

export default Pillars;
