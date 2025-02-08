import styles from './Footer.module.css';
import Image from 'next/image'; // Re-enable Image import
import Link from 'next/link';
import Carousel from '../Carousel/Carousel';

const Footer = () => {
  const carouselImages = [
    '/pies-img-example.png',
    '/pies-retreat.png',
    '/pies-kbbq.png',
  ];

  return (
    <div>
      <div className={styles.infoFooter}>
        <div className={styles.imageSection}>
          <Carousel images={carouselImages} />
        </div>
        <div className={styles.textContainer}>
          <div className={styles.textSection}>
            <h1>Pilipinos in Engineering & Science</h1>
            <h1>PIES @ UCLA</h1>
            <h2>Est. 1993</h2>
          </div>
          <div className={styles.textSection1}>
            <p>PIES, founded in 1993, empowers Pilipino STEM students at UCLA with community, resources, and mentorship to thrive in competitive environments and achieve lasting success</p>
            <div className={styles.learnMoreButton}>
              <Link href="/about">Learn More</Link>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.navySection}>
        <h1 className={styles.navyHeader}>Our Past Events</h1>
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
      </div>
      <div className={styles.quickLinksSection}>
        <h1 className={styles.quickLinksHeader}>Quick Links</h1>
      </div>
      {/* <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} by PIES UCLA.</p>
      </footer> */}
    </div>
  );
};

export default Footer;