"use client";

import Link from "next/link";
import Image from "next/image";
import styles from './Navbar.module.css';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

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
                    <Link href="/get-involved">Bi-weekly meetings from 6-8pm on Tuesdays!</Link>
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
                    <li className={styles.navItem}>
                        <Link href="/resources">Resources</Link>
                    </li>
                    <li className={styles.navItem}>
                        <div 
                            className={`${styles.box1} ${dropdownOpen ? styles.active : ''}`}
                            onClick={toggleDropdown}
                            ref={dropdownRef}
                        >
                            <span>Get Involved</span>
                            <span className={styles.dropdownArrow}></span>
                            
                            {dropdownOpen && (
                                <div className={styles.dropdownMenu}>
                                    <Link href="/membership" className={styles.dropdownItem}>
                                        Membership
                                    </Link>
                                    <Link 
                                        href="/newsletter" 
                                        className={styles.dropdownItem}
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Newsletter
                                    </Link>
                                    <Link href="/mentorship" className={styles.dropdownItem}>
                                        Mentorship
                                    </Link>
                                    <Link href="/join" className={styles.dropdownItem}>
                                        Join PIES
                                    </Link>
                                </div>
                            )}
                        </div>
                    </li>
                </ul>
            </nav>
            <div className={styles.navbarSpacer}></div>
        </>
    )
}