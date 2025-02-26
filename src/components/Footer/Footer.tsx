"use client";
import { motion } from 'framer-motion';
import styles from './Footer.module.css';
import Image from 'next/image'; // Re-enable Image import
import Link from 'next/link';
import Carousel from '../Carousel/Carousel';
import { useEffect, useState } from 'react';
import Pillars from '../Pillars/Pillars';

const Footer = () => {
  // Add state for client-side rendering
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const carouselImages = [
    '/pies-img-example.png',
    '/pies-retreat.png',
    '/pies-kbbq.png',
  ];

  // const newsItems = [
  //   {
  //     image: '/news-1.png',
  //     title: 'PIES Fall GM #1',
  //     date: 'October 5, 2023',
  //     description: 'Join us for our first General Meeting of the year! Come meet the board and learn more about what PIES has planned for Fall Quarter.'
  //   },
  //   {
  //     image: '/news-2.png',
  //     title: 'PIES Industry Night',
  //     date: 'October 12, 2023',
  //     description: 'Network with industry professionals and PIES alumni in engineering and sciences. Great opportunity to learn about different career paths!'
  //   },
  //   {
  //     image: '/news-3.png',
  //     title: 'PIES Study Night',
  //     date: 'October 19, 2023',
  //     description: 'Study with your fellow PIES members! Snacks and drinks will be provided.'
  //   }
  // ];

  const fadeInUp = {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    // Only render when on client-side
    isClient ? (
      <div>
        <motion.div 
          className={styles.infoFooter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.mainContent}>
            <motion.div 
              className={styles.imageSection}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Carousel 
                images={carouselImages} 
                width={800}   // Specify desired width
                height={600}  // Specify desired height
              />
            </motion.div>
            <motion.div 
              className={styles.textContainer}
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div 
                className={styles.textSection}
                variants={fadeInUp}
              >
                <h1 className={styles.mainTitle}>Pilipinos in Engineering & Sciences</h1>
                <h1>P I E S @ U C L A</h1>
                <h2>Est. 1993</h2>
              </motion.div>
              <motion.div 
                className={styles.textSection1}
                variants={fadeInUp}
              >
                <p>PIES, founded in 1993, empowers Pilipino STEM students at UCLA with community, resources, and mentorship to thrive in competitive environments and achieve lasting success</p>
                <motion.div 
                  className={styles.learnMoreButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/about">Learn More!</Link>
                </motion.div>
                <div className={styles.socialLinks}>
                  <a href="https://www.instagram.com/piesatucla/" target="_blank" rel="noopener noreferrer">
                    <Image src="/instagram.png" alt="Instagram" width={24} height={24} />
                  </a>
                  <a href="https://www.linkedin.com/company/pilipinos-in-engineering-and-sciences/" target="_blank" rel="noopener noreferrer">
                    <Image src="/linkedln.png" alt="LinkedIn" width={24} height={24} />
                  </a>
                  <a href="" target="_blank" rel="noopener noreferrer">
                    <Image src="/email.png" alt="Email" width={24} height={24} />
                  </a>
                  <a href="https://www.facebook.com/uclapies/" target="_blank" rel="noopener noreferrer">
                    <Image src="/facebook.png" alt="Facebook" width={24} height={24} />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
          <motion.div 
            // className={styles.newsSection}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* <h2 className={styles.newsSectionTitle}>Latest News</h2>
            {newsItems.map((item, index) => (
              <motion.div 
                key={index} 
                className={styles.newsItem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className={styles.newsImageContainer}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={90}
                    height={90}
                    className={styles.newsImage}
                  />
                </div>
                <div className={styles.newsContent}>
                  <h3 className={styles.newsTitle}>{item.title}</h3>
                  <p className={styles.newsDate}>{item.date}</p>
                  <p className={styles.newsDescription}>{item.description}</p>
                </div>
              </motion.div>
            ))} */}
          </motion.div>
        </motion.div>

       
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Pillars />
        </motion.div>


        <motion.div 
          className={styles.navySection}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h1 
            className={styles.navyHeader}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >

          <div ></div>

            Our Past Events
          </motion.h1>
          <h2 className={styles.navySubheader}>Follow us on IG to stay updated!</h2>
          <div className={styles.eventImages}>
            {['/pies-gm-4.png', '/pies-gm-5.png', '/pies-gm-6.png'].map((src, index) => (
              <div key={index} className={styles.eventImageContainer}>
                <Image
                  src={src}
                  alt={`Event ${index + 1}`}
                  width={300}
                  height={300}
                  className={styles.eventImage}
                />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className={styles.quickLinksSection}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1 className={styles.quickLinksHeader}>Quick Links</h1>
        </motion.div>
        {/* <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} by PIES UCLA.</p>
        </footer> */}
      </div>
    ) : null // Or a loading state if preferred
  );
};

export default Footer;