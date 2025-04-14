import styles from "./members.module.css";

export default function Resources() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Members Only</h1>
      <div className={styles.subsection}>
        <button className={styles.button}>STUDYING RESOURCES</button>
        <p className={styles.caption}>Link to a shared resource open to anyone in PIES.</p>
      </div>
      <div className={styles.subsection}>
        <button className={styles.button}>GROUPME</button>
        <p className={styles.caption}>Access to the 2024/25 PIES GroupMe! Used for announcements, events, etc.</p>
      </div>
      <div className={styles.subsection}>
        <button className={styles.button}>SHARED CLASSES SPREADSHEET</button>
        <p className={styles.caption}>Access to the 2024/25 PIES GroupMe! Used for announcements, events, etc.</p>
      </div>
      <div className={styles.subsection}>
        <button className={styles.button}>GOOGLE DRIVE FOR PHOTOS</button>
        <p className={styles.caption}>Access to the 2024/25 PIES GroupMe! Used for announcements, events, etc.</p>
      </div>
      <div className={styles.subsection}>
        <button className={styles.button}>DISCORD</button>
        <p className={styles.caption}>Access to the 2024/25 PIES GroupMe! Used for announcements, events, etc.</p>
      </div>
      <div className={styles.subsection}>
        <button className={styles.button}>FINANCIAL ACCESSIBILITY FORM</button>
        <p className={styles.caption}>Access to the 2024/25 PIES GroupMe! Used for announcements, events, etc.</p>
      </div>
    </div>
  );
}
