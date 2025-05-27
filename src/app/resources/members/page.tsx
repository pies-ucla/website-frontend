import styles from "./members.module.css";
import Link from "next/link";

export default function Resources() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Members Only</h1>
      <div className={styles.subsection}>
        <button className={styles.button}>STUDYING RESOURCES</button>
        <p className={styles.caption}>Link to a shared resource open to anyone in PIES.</p>
      </div>
      <div className={styles.subsection}>
        <Link 
          href={{pathname: 'https://groupme.com/join_group/103471220/ln5Qru4A'}}
          className={styles.caption}
          target="_blank"
        >
          <button className={styles.button}>GROUPME</button>
        </Link>
        <p className={styles.caption}>Access to the 2024/25 PIES GroupMe! Used for announcements, events, etc.</p>
      </div>
      <div className={styles.subsection}>
        <Link 
          href={{pathname: 'https://forms.gle/CjkJmLsGnf3hyDaYA'}}
          className={styles.caption}
          target="_blank"
        >
          <button className={styles.button}>SHARED CLASSES SPREADSHEET</button>
        </Link>
        <p className={styles.caption}>See who you share classes with (Perfect for assassins!)</p>
      </div>
      <div className={styles.subsection}>
        <Link 
          href={{pathname: 'https://drive.google.com/drive/u/1/folders/1Rpt0JhXPlQDgXH_u02m6NPk1xscAy-Dn'}}
          className={styles.caption}
          target="_blank"
        >
          <button className={styles.button}>GOOGLE DRIVE FOR PHOTOS</button>
        </Link>
        <p className={styles.caption}>Access to the shared drive for photos! Where&apos;sd all the time go...?</p>
      </div>
      <div className={styles.subsection}>
        <Link
          href={{pathname: 'https://discord.gg/GbXvcJSXzz'}}
          className={styles.caption}
          target="_blank"
        >
        <button className={styles.button}>DISCORD</button>
        </Link>
        <p className={styles.caption}>Access to the PIES Discord. Come hang out with us!</p>
      </div>
      <div className={styles.subsection}>
        <Link
          href={{pathname: 'https://forms.gle/C2W6386xouBSKoZd6'}}
          className={styles.caption}
          target="_blank"
        >
          <button className={styles.button}>FINANCIAL ACCESSIBILITY FORM</button>
        </Link>
        <p className={styles.caption}>Access to the PIES financial accessibility form!</p>
      </div>
    </div>
  );
}
