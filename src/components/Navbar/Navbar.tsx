import Link from "next/link";
import Image from "next/image";
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <>
            <div className={styles.socialBar}>
                <div className={styles.socialBox}>
                    
                <div className={styles.socialBox1}>
                   <div className={styles.logoContainer1}>
                     <Image 
                        src="/logo-placeholder.png" 
                        alt="PIES" 
                        width={50} 
                        height={50}
                        className={styles.logoImage}
                     />
                    </div>

                    <div className={styles.logoContainer}>
                     <Image 
                        src="/logo-placeholder.png" 
                        alt="PIES Logo" 
                        width={50} 
                        height={50}
                        className={styles.logoImage}
                     />
                    </div>
                    <div className={styles.clickHereToGetInvolved}>
                    <Link href="/get-involved">Click here to get involved!</Link>
                    </div>
                </div>
              
                </div>
            </div>
            <nav className={styles.navbar}>
                <ul className={styles.navList}>
                    <li className={styles.navItem}>
                        <Link href="/"><u>Home</u></Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/about">About Us </Link>
                    </li>
                    {/* <li className={styles.navItem}>
                        <Link href="/events">Events</Link>
                    </li> */}
                    {/* <li className={styles.navItem}>
                        <Link href="/alumni">Alumni</Link>
                    </li> */}
                    <li className={styles.navItem}>
                        <Link href="/resources">Resources</Link>
                    </li>
                    {/* <li className={styles.navItem}>
                        <Link href="/ask-pierre">Ask Pierre</Link>
                    </li> */}
                    <li className={styles.navItem}>
                        <div className={styles.box1}>
                            <Link href="/get-involved">Get Involved</Link>
                        </div>
                    </li>
                </ul>
            </nav>
            <div className={styles.navbarSpacer}></div>
        </>
    )
}