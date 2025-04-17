"use client";

import Link from "next/link";
import Image from "next/image";
import styles from './Navbar.module.css';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const loginURL = "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:3000/auth/callback/&prompt=consent&response_type=code&client_id=229386821939-n5l1mhe4h7u497v93dksk76f8s46fu69.apps.googleusercontent.com&scope=openid email profile&access_type=offline";
    const { user, logout, loading } = useAuth();
    console.log("user", user);
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
    
    if (loading) return <p>Loading...</p>
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
                        <div className={styles.hoverDropdown}>
                            <span>About Us</span>
                            <div className={styles.dropdownMenu}>
                            <Link href="/about" className={styles.dropdownItem}>About Us</Link>
                            <Link href="/about/board" className={styles.dropdownItem}>Board</Link>
                            </div>
                        </div>
                    </li>
                    <li className={styles.navItem}>
                        <div className={styles.hoverDropdown}>
                            <span>Resources</span>
                            <div className={styles.dropdownMenu}>
                                <Link href="/resources" className={styles.dropdownItem}>Resources</Link>
                                <Link href="/resources/members" className={styles.dropdownItem}>Members Only</Link>
                                <Link href="/resources/alumni" className={styles.dropdownItem}>Alumni</Link>
                                <Link href="/resources/ask-pierre" className={styles.dropdownItem}>Ask Pierre</Link>
                            </div>
                        </div>
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
                    <li className={styles.navItem}>
                        <div>
                            {
                                user ? (
                                    <>
                                        <h1>Welcome, {user.first_name}</h1>
                                        <button onClick={logout}>Logout</button>
                                    </>
                                ) : (
                                    <a href={loginURL} className={styles.loginButton}>
                                        Login with Google
                                    </a>
                                )
                            }
                        </div> 
                        {
                        }
                    </li>
                </ul>
            </nav>
            <div className={styles.navbarSpacer}></div>
        </>
    )
}