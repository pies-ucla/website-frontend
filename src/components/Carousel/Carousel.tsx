"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Carousel.module.css';

interface CarouselProps {
  images: string[];
  width?: number;
  height?: number;
  autoScrollInterval?: number; // in milliseconds
}

const Carousel = ({
  images,
  width = 800,
  height = 600,
  autoScrollInterval = 3000, // default to 3 seconds
}: CarouselProps) => {
  const [isClient, setIsClient] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, autoScrollInterval);

    return () => clearInterval(interval); // cleanup on unmount
  }, [isClient, images.length, autoScrollInterval]);

  return isClient ? (
    <div className={styles.carousel}>
      <div className={styles.carouselImageContainer}>
        <Image
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          fill
          className={styles.carouselImage} // use enter animation class
          style={{ objectFit: 'contain' }}
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