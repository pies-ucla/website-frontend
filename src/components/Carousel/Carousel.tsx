"use client";

import { useState, useEffect } from 'react';
import styles from './Carousel.module.css';
import ImageSlot from '../ImageSlot/ImageSlot';
import { useAuth } from '@/context/AuthContext';

interface CarouselProps {
  images: string[];
  width?: number;
  height?: number;
  autoScrollInterval?: number; // in milliseconds
  editable?: boolean;
  slotPrefix?: string;
  targetDir?: string; 
}

const Carousel = ({
  images,
  autoScrollInterval = 3000, // default to 3 seconds
  slotPrefix = 'carousel',
  targetDir = 'carousel',
}: CarouselProps) => {
  const [isClient, setIsClient] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isBoardMember } = useAuth();
  const [imagesState, setImagesState] = useState(
    images.map((img) => `${img}?t=${Date.now()}`)
  );


  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // makes it easier for board members to replace photos if it doesn't autoscroll
    if (!isClient || isBoardMember) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === imagesState.length - 1 ? 0 : prevIndex + 1
      );
    }, autoScrollInterval);

    return () => clearInterval(interval); // cleanup on unmount
  }, [isClient, isBoardMember, imagesState.length, autoScrollInterval]);

  return isClient ? (
    <div className={styles.carousel}>
      <div className={styles.carouselImageContainer}>
        <ImageSlot
          slot={`${slotPrefix || 'carousel'}_${currentIndex}`}
          src={imagesState[currentIndex]}
          editable={isBoardMember}
          targetDir={targetDir || 'carousel'}
          onImageReplaced={(newUrl) => {
            const updatedImages = [...imagesState];
            updatedImages[currentIndex] = `${newUrl}?t=${Date.now()}`;
            setImagesState(updatedImages); // Force re-render
          }}
          className={styles.carouselImage}
        />
      </div>
      <div className={styles.indicators}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  ) : null;
};

export default Carousel;