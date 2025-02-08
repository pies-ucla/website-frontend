import Link from "next/link";
import Image from "next/image";
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <>
            <div className={styles.socialBar}>
                <div className={styles.socialBox}>
                <a href="https://www.instagram.com/piesatucla/" target="_blank" rel="noopener noreferrer">
                    <Image src="/instagram.png" alt="Instagram" width={24} height={24} /> 
                </a>
                </div>
            </div>
            <nav className={styles.navbar}>
                <div className={styles.logoContainer}>
                <Image 
                        src="/logo-placeholder.png" 
                        alt="PIES Logo" 
                        width={50} 
                        height={50}
                        className={styles.logoImage}
                    />
                    </div>
                    
                <div className={styles.piesLogo}>PIES</div>
                    
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