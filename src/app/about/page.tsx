"use client";

import React, { useState } from 'react';
import styles from './about.module.css';
import Image from 'next/image';
import Carousel from '@/components/Carousel/Carousel';
import ImageSlot from '@/components/ImageSlot/ImageSlot';
import { useAuth } from '@/context/AuthContext';

export default function About() {
  const carouselImages = [
    '/carousel/about/about_0.webp',
    '/carousel/about/about_1.webp',
    '/carousel/about/about_2.webp',
    '/carousel/about/about_3.webp',
    '/carousel/about/about_4.webp',
  ];

  const { isBoardMember } = useAuth();
  const [images, setImages] = useState({
      vision: `/about/vision.webp?t=${Date.now()}`,
      mission: `/about/mission.webp?t=${Date.now()}`,
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>About PIES</h1>

      <div className={styles.columns}>
        <div>
          <h2>OUR VISION:</h2>
          <div className={styles.textbox}>
            <p>Pilipinos in Engineering and Science (PIES) is dedicated to creating opportunities for UCLA students to become a part of this growing industry and to increase Pilipino representation within Engineering and the Applied Sciences. With a growing sector in technology development, there is a need for Pilipino representation to be seen as equals to other ethnicities and major contributors to the development of surrounding communities.</p>
            <ImageSlot
              slot="vision"
              src={images.vision}
              editable={isBoardMember}
              targetDir="about"
              onImageReplaced={(newUrl) =>
                setImages((prev) => ({
                  ...prev,
                  vision: `${newUrl}?t=${Date.now()}` // 👈 force refresh
                }))
              }
              className={styles.replaceableImage}
            />
          </div>
        </div>
        <div>
          <h2>OUR MISSION</h2>
          <div className={styles.textbox}>
            <p>To ensure PIES' success in fulfilling its purpose, PIES must be dedicated to the personal and professional growth of its general members, specifically through its four pillars: Pilipino, Innovation, Education, and Social. By fostering a strong sense of cultural identity, promoting academic excellence, and building a supportive social network, PIES empowers its members to thrive both within and beyond the university setting.</p>
            <ImageSlot
              slot="mission"
              src={images.mission}
              editable={isBoardMember}
              targetDir="about"
              onImageReplaced={(newUrl) =>
                setImages((prev) => ({
                  ...prev,
                  mission: `${newUrl}?t=${Date.now()}` // 👈 force refresh
                }))
              }
              className={styles.replaceableImage}
            />
          </div>
        </div>
      </div>
      <div className={styles.timeline}>
        <h2>PIES Timeline</h2>
        <Carousel 
          images={carouselImages} 
          width={800}   // Specify desired width
          height={600}  // Specify desired height
          slotPrefix="about"
          targetDir="carousel/about"
        />
      </div>
    </div>
  );
}
