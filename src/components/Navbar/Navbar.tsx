import Link from "next/link";
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link href="/">Home</Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/about">About</Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/events">Events</Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/alumni">Alumni</Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/resources">Resources</Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/ask-pierre">Ask Pierre</Link>
                </li>
            </ul>
        </nav>
    )
}