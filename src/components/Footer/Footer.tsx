import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div>
      <div className={styles.infoFooter}>
        <div className={styles.infoBox}>
          <h1>Pilipinos in Engineering and Science</h1>
          <p>Welcome to PIES! We are an organization at UCLA dedicated to helping our members succeed academically and thrive socially during their time at UCLA and beyond.</p>
        </div>
        <div className={styles.infoBox}>
          <h1>PIES Weekly Newsletter Interest Form</h1>
          <p>Want to get weekly updates about PIES events, new resources/scholarships, +more? Click the following link and fill out the form to become a part of PIES Weekly Newsletter mailing list!</p>
        </div>
        <div className={styles.infoBox}>
          <h1>Quick Links</h1>
        </div>
      </div>
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} by PIES UCLA.</p>
      </footer>
    </div>
  );
};

export default Footer;