"use client";
import { motion } from 'framer-motion';
import styles from './HomePage.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, type CSSProperties } from 'react';
import Pillars from '../Pillars/Pillars';
import StaticModalCard from '../StaticPierreCard/StaticModal';
import { FaInstagram, FaLinkedinIn, FaEnvelope, FaFacebookF } from 'react-icons/fa6';
const API_URL =  process.env.NEXT_PUBLIC_API_URL;

type Event = {
  event_name: string;
  date_time: string;
  location: string;
  description: string;
  image_url?: string | null;
};

// polaroid frame with a photo pinned inside it. On desktop, x is where its center sits
// (% of the board width), y is its top (em, so it scales with the polaroids), and
// rotate tilts it. On mobile the CSS lays them out in a grid instead (see .polaroids)
const Polaroid = ({ src, x, y, rotate }: { src: string; x: number; y: number; rotate: number }) => (
  <div
    className={styles.polaroid}
    style={{ "--x": `calc(${x}% - 13.125em)`, "--y": `${y}em`, "--rotate": `${rotate}deg` } as CSSProperties}
  >
    <Image src="/polaroid.png" alt="" width={750} height={563} className={styles.polaroidFrame} />
    <Image src={src} alt="" width={4032} height={3024} className={styles.polaroidPhoto} />
  </div>
);

// two staggered rows (3 on top, 4 below) mirrored around the middle so the group stays centered
const POLAROIDS = [
  { src: "/pictures/pic2.jpg", x: 25, y: 0, rotate: -8 },
  { src: "/pictures/pic1.jpg", x: 50, y: 1, rotate: 4 },
  { src: "/pictures/pic3.jpg", x: 75, y: 0, rotate: 10 },
  { src: "/pictures/pic4.jpg", x: 20, y: 15, rotate: 6 },
  { src: "/pictures/pic5.jpg", x: 40, y: 16, rotate: -5 },
  { src: "/pictures/pic6.jpg", x: 60, y: 15, rotate: 7 },
  { src: "/pictures/pic7.jpg", x: 80, y: 16, rotate: -9 },
];

const HomePage = () => {
  // Add state for client-side rendering
  const [events, setEvents] = useState<Event[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/api/events`);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };
    fetchEvents();
  }, []);
  const now = new Date();
  const upcomingEvents = events
  .filter((e) => new Date(e.date_time) > now)
  .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())
  .slice(0, 3);

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
              className={styles.textContainer}
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* bottom-right: shift right & down by half */}
              <Image src="/pierre_sticker.png" alt="" width={500} height={500}
                style={{ position: "absolute", right: "calc(2% + 6em)", bottom: "calc(5% + 5em)",
                  height: "15em", width: "15em", transform: "translate(50%, 50%)" }} />

              {/* top-right: shift right & up */}
              <Image src="/planer.png" alt="" width={500} height={500}
                style={{ position: "absolute", right: "calc(1% + 8em)", top: "calc(-2% + 11em)",
                  height: "16em", width: "16em", transform: "translate(50%, -50%)" }} />

              {/* bottom-left: shift left & down */}
              <Image src="/stars.png" alt="" width={500} height={500}
                style={{ position: "absolute", left: "calc(1% + 10em)", bottom: "calc(-2% + 10em)",
                  height: "18em", width: "18em", transform: "translate(-50%, 50%)" }} />
              <motion.div 
                className={styles.textSection}
                variants={fadeInUp}
              >
                <h1 className={styles.mainTitle}>Pilipinos in Engineering & Sciences</h1>
                <h1>PIES @ UCLA</h1>
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
          className={styles.picturesSection}
          viewport={{ once: true }}
        >
          <div
            className={styles.pictureBoard}
          >
            <h1 className={styles.connectHeader}>Connect with us!</h1>
            <div className={styles.socialLinks}>
              <a href="https://www.instagram.com/piesatucla/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialIcon}>
                <FaInstagram />
              </a>
              <a href="https://www.linkedin.com/company/pilipinos-in-engineering-and-sciences/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.socialIcon}>
                <FaLinkedinIn />
              </a>
              <a href="" target="_blank" rel="noopener noreferrer" aria-label="Email" className={styles.socialIcon}>
                <FaEnvelope />
              </a>
              <a href="https://www.facebook.com/uclapies/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.socialIcon}>
                <FaFacebookF />
              </a>
            </div>

            <div className={styles.polaroids}>
              {POLAROIDS.map((p, i) => (
                <Polaroid key={i} {...p} />
              ))}
            </div>

          </div>
        </motion.div>

        <motion.div
          className={styles.pillarsSection}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
            <h1 className={styles.pillarsHeader}>Our Pillars</h1>
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

            Upcoming Events
          </motion.h1>
          <h2 className={styles.navySubheader}>Follow us on IG to stay updated!</h2>
          <div className={styles.eventImages}>
            {upcomingEvents.length === 0 ? (
              <div className={styles.noEvents}>No upcoming events!</div>
            ) : (
                upcomingEvents.map((event, index) => (
                  <div key={index} className={styles.eventImageContainer}>
                    {event.image_url ? (
                      <Image
                        src={event.image_url}
                        alt={event.event_name}
                        width={300}
                        height={300}
                        className={styles.eventImage}
                      />
                    ) : (
                        <StaticModalCard>
                          <h3>{event.event_name}</h3>
                          <p>
                            {new Date(event.date_time).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </p>
                          <p>{event.location}</p>
                          <p>{event.description}</p>
                        </StaticModalCard>
                      )}
                  </div>
                ))
              )}
          </div>
        </motion.div>
      </div>
    ) : null
  );
};

export default HomePage;
