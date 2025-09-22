"use client";

import Link from "next/link";
import Image from "next/image";
import styles from './Navbar.module.css';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from "@/context/AuthContext";
import { FiMenu, FiX } from 'react-icons/fi';
const API_URL =  process.env.NEXT_PUBLIC_API_URL;

export default function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${API_URL}/auth/callback/&prompt=consent&response_type=code&client_id=229386821939-n5l1mhe4h7u497v93dksk76f8s46fu69.apps.googleusercontent.com&scope=openid email profile&access_type=offline`;
    const { user, logout, loading, isAdmin } = useAuth();
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
                <Image
                    src="/icons/logo.png"
                    alt="PIE"
                    width={50}
                    height={50}
                    className={styles.logoImage}
                />
                <div className={styles.getInvolvedBox}>
                    <Link href="/opportunities">
                    Bi-weekly meetings from 6-8pm on Wednesdays @ Dodd Hall 175!
                    </Link>
                </div>
            </div>
            <nav className={styles.navbar}>
                <div className={styles.navHeader}>
                    <button
                    className={styles.hamburger}
                    onClick={() => setMobileMenuOpen(prev => !prev)}
                    >
                    {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
                <ul className={`${styles.navList} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
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
                                    <Link href="/opportunities" className={styles.dropdownItem}>
                                        Opportunities
                                    </Link>
                                    <Link href="/interest-form" className={styles.dropdownItem}>
                                        Interest Form
                                    </Link>
                                    <Link 
                                        href="/newsletter" 
                                        className={styles.dropdownItem}
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Newsletter
                                    </Link>
                                    <Link href="/events" className={styles.dropdownItem}>
                                        Events
                                    </Link>
                                </div>
                            )}
                        </div>
                    </li>
                    <li className={styles.navItem}>
                        <div>
                            {
                                user ? (
                                    <div className={styles.userInfo}>
                                        {isAdmin && (
                                            <Link href="/admin">
                                                <button className={styles.adminButton}>Admin</button>
                                            </Link>
                                        )}
                                        <span>Welcome, {user.first_name}!</span>
                                        <button onClick={logout} className={styles.logoutButton}>Logout</button>
                                    </div>
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