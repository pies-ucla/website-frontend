"use client";

import React, { useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './about.module.css';
import Carousel from '@/components/Carousel/Carousel';
import ImageSlot from '@/components/ImageSlot/ImageSlot';
import { useAuth } from '@/context/AuthContext';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
  viewport: { once: true },
};

export default function About() {
  const carouselImages = [
    '/carousel/about/about_0.jpg',
    '/carousel/about/about_1.jpg',
    '/carousel/about/about_2.jpg',
    '/carousel/about/about_3.jpg',
    '/carousel/about/about_4.jpg',
  ];

  const { isBoardMember, isAdmin } = useAuth();
  // no ?t= cache-buster here: Date.now() differs between the server and browser render, which
  // breaks hydration and downloads each photo twice. A fresh one is added once a photo is replaced
  const [images, setImages] = useState({
      vision: '/about/vision.jpg',
      mission: '/about/mission.jpg',
  });

  const sections = [
    {
      key: 'vision' as const,
      title: 'Our Vision',
      rotate: -4,
      text: "Pilipinos in Engineering and Science (PIES) is dedicated to creating opportunities for UCLA students to become a part of this growing industry and to increase Pilipino representation within Engineering and the Applied Sciences. With a growing sector in technology development, there is a need for Pilipino representation to be seen as equals to other ethnicities and major contributors to the development of surrounding communities.",
    },
    {
      key: 'mission' as const,
      title: 'Our Mission',
      rotate: 4,
      text: "To ensure PIES' success in fulfilling its purpose, PIES must be dedicated to the personal and professional growth of its general members, specifically through its four pillars: Pilipino, Innovation, Education, and Social. By fostering a strong sense of cultural identity, promoting academic excellence, and building a supportive social network, PIES empowers its members to thrive both within and beyond the university setting.",
    },
  ];

  return (
    <div className={styles.container}>
      {/* hero, same paper + stickers as the top of the home page */}
      <section className={styles.hero}>
        <Image src="/stars.png" alt="" width={500} height={500} className={`${styles.sticker} ${styles.stars}`} />
        <Image src="/planer.png" alt="" width={500} height={500} className={`${styles.sticker} ${styles.planer}`} />
        <motion.div
          className={styles.heroText}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className={styles.kicker}>get to know us</p>
          <h1 className={styles.header}>About PIES</h1>
          <p className={styles.tagline}>Pilipinos in Engineering &amp; Sciences, est. 1993</p>
        </motion.div>
      </section>

      {/* vision + mission, each on a sheet of square paper with its photo pinned on as a polaroid */}
      <section className={styles.paperSection}>
        <div className={styles.columns}>
          {sections.map((section) => (
            <motion.div key={section.key} className={styles.card} {...fadeInUp}>
              <h2 className={styles.cardTitle}>{section.title}</h2>
              <p className={styles.cardText}>{section.text}</p>
              <div className={styles.polaroid} style={{ '--rotate': `${section.rotate}deg` } as CSSProperties}>
                <Image src="/polaroid.png" alt="" width={750} height={563} className={styles.polaroidFrame} />
                <ImageSlot
                  slot={section.key}
                  src={images[section.key]}
                  editable={isBoardMember || isAdmin}
                  targetDir="about"
                  onImageReplaced={(newUrl) =>
                    setImages((prev) => ({
                      ...prev,
                      [section.key]: `${newUrl}?t=${Date.now()}` // 👈 force refresh
                    }))
                  }
                  className={styles.polaroidPhoto}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.section className={styles.timeline} {...fadeInUp}>
        <h2 className={styles.timelineHeader}>PIES Timeline</h2>
        <p className={styles.timelineSubheader}>a look back at the years</p>
        <div className={styles.timelineBoard}>
          <Carousel
            images={carouselImages}
            width={800}   // Specify desired width
            height={600}  // Specify desired height
            slotPrefix="about"
            targetDir="carousel/about"
          />
        </div>
      </motion.section>
    </div>
  );
}
