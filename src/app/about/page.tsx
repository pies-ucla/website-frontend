import React from 'react';
import styles from './about.module.css';
import Image from 'next/image';
import Carousel from '@/components/Carousel/Carousel';

export default function About() {
  const carouselImages = [
    '/carousel/about/kbbq.png',
    '/carousel/about/dtla.JPG',
    '/carousel/about/bonfire.JPG',
    '/carousel/about/retreat.png',
    '/carousel/about/spcn.JPG',
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>About PIES</h1>

      <div className={styles.columns}>
        <div>
          <h2>OUR VISION:</h2>
          <div className={styles.textbox}>
            <p>Pilipinos in Engineering and Science (PIES) is dedicated to creating opportunities for UCLA students to become a part of this growing industry and to increase Pilipino representation within Engineering and the Applied Sciences. With a growing sector in technology development, there is a need for Pilipino representation to be seen as equals to other ethnicities and major contributors to the development of surrounding communities.</p>
            <Image
              src="/about/vision.png"
              alt="PIES meeting" 
              width={1920} 
              height={1080}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '5px',
                marginTop: '1rem'
              }}
            />
          </div>
        </div>
        <div>
          <h2>OUR MISSION</h2>
          <div className={styles.textbox}>
            <p>To ensure PIES' success in fulfilling its purpose, PIES must be dedicated to the personal and professional growth of its general members, specifically through its four pillars: Pilipino, Innovation, Education, and Social. By fostering a strong sense of cultural identity, promoting academic excellence, and building a supportive social network, PIES empowers its members to thrive both within and beyond the university setting.</p>
            <Image
              src="/about/mission.JPG"
              alt="PIES meeting" 
              width={1920} 
              height={1080}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '5px',
                marginTop: '1rem'
              }}
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
        />
      </div>
    </div>
  );
}
