"use client";

import { useState } from 'react';
import Image from 'next/image';
import styles from './Carousel.module.css';

interface CarouselProps {
    images: string[];
}

const Carousel = ({ images }: CarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // const nextSlide = () => {
    //     setCurrentIndex((prevIndex) => 
    //         prevIndex === images.length - 1 ? 0 : prevIndex + 1
    //     );
    // };

    // const prevSlide = () => {
    //     setCurrentIndex((prevIndex) => 
    //         prevIndex === 0 ? images.length - 1 : prevIndex - 1
    //     );
    // };

    return (
        <div className={styles.carousel}>
            {/* <button 
                className={styles.carouselButton} 
                onClick={prevSlide}
                aria-label="Previous image"
            >
                ←
            </button> */}
            <div className={styles.carouselImageContainer}>
                <Image
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    width={600}  
                    height={400}  
                    className={styles.carouselImage}
                />
            </div>
            {/* <button 
                className={styles.carouselButton} 
                onClick={nextSlide}
                aria-label="Next image"
            >
                →
            </button> */}
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
    );
};

export default Carousel;
