import { useState } from 'react';
import styles from './Pillars.module.css';

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
  const [activeIndex, setActiveIndex] = useState(1);
  
  // State to track if pillar is in active animation state
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handlePrevClick = () => {
    setActiveIndex((prev) => (prev === 0 ? pillars.length - 1 : prev - 1));
  };

  const handleNextClick = () => {
    setActiveIndex((prev) => (prev === pillars.length - 1 ? 0 : prev + 1));
  };
  
  // Handle active pillar click
  const handleActivePillarClick = () => {
    // Trigger animation
    setIsAnimating(true);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
    
    // You could also add navigation to relevant page here
    console.log(`Clicked on ${pillars[activeIndex]}`);
    
    // Example: navigate to a page based on the active pillar
    // if (typeof window !== 'undefined') {
    //   window.location.href = `/${pillars[activeIndex].toLowerCase()}`;
    // }
  };

  // Get the current three pillars to display
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
      
      {/* Optional floating indicator to show pillar is clickable */}
      {!isAnimating && (
        <div className={styles.clickIndicator}>
          Click to learn more
        </div>
      )}
    </div>
  );
};

export default Pillars;
