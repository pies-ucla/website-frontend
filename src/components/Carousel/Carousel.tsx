"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Carousel.module.css';

interface CarouselProps {
    images: string[];
    width?: number;  // Add optional width prop
    height?: number; // Add optional height prop
}

const Carousel = ({ images, width = 800, height = 600 }: CarouselProps) => {
    const [isClient, setIsClient] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return isClient ? (
        <div className={styles.carousel}>
            <div className={styles.carouselImageContainer}>
                <Image
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    width={width}  // Use custom width
                    height={height} // Use custom height
                    className={styles.carouselImage}
                    style={{ objectFit: 'contain' }} // Ensure image maintains aspect ratio
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
    ) : null; // Or a loading placeholder
};

export default Carousel;
