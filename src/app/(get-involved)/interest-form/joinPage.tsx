"use client";

import { useState } from 'react';
import Image from 'next/image';
import styles from './joinPage.module.css';

export default function JoinPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [major, setMajor] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [year, setYear] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus({});
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, major, pronouns, year }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmissionStatus({
          success: true,
          message: 'Thank you for your interest in PIES! We\'ll be in touch soon.'
        });
        setName('');
        setEmail('');
        setMajor('');
        setPronouns('');
        setYear('');
      } else {
        setSubmissionStatus({
          success: false,
          message: data.error || 'Failed to submit. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionStatus({
        success: false,
        message: 'An error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <main className={styles.container}>
      <div className={styles.headerContainer}>
        <h1 className={styles.title}>General Member Interest Form</h1>
        <div className={styles.imageContainer}>
          <Image 
            src="/newsletter-placeholder.png" 
            alt="PIES Membership" 
            width={300} 
            height={200}
            className={styles.headerImage}
            priority={true}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://via.placeholder.com/300x200?text=PIES+Membership";
            }}
          />
        </div>
      </div>
      
      <div className={styles.description}>
        <p>
          Hi and Welcome! Thank you for expressing your interest in our club, Pilipinos
          in Engineering and Science!! Please fill out the information below so we can learn
          more about you and contact you when we have one of our events. Filling out this 
          form will automatically sign you up for PIES&apos;s Weekly newsletter, which can be
          unsubscribed at any time.
        </p>
      </div>
      
      {submissionStatus.message && (
        <div className={`${styles.statusMessage} ${submissionStatus.success ? styles.success : styles.error}`}>
          {submissionStatus.message}
        </div>
      )}
      
      <form className={styles.joinForm} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label className={styles.inputText} htmlFor="name">Preferred Name (first & last)</label>
          <input 
            id="name"
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.inputField}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.inputText} htmlFor="email">Email Address</label>
          <input 
            id="email"
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputText} htmlFor="major">Major(s) + Minor(s)</label>
          <input 
            id="major"
            type="text" 
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className={styles.inputField}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.twoColumnContainer}>
          <div className={styles.columnLeft}>
            <label className={styles.inputText} htmlFor="pronouns">Pronouns</label>
            <input 
              id="pronouns"
              type="text" 
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
              className={styles.inputFieldHalf}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.columnRight}>
            <label className={styles.inputText} htmlFor="year">Year</label>
            <select 
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={styles.inputFieldHalf}
              required
              disabled={isSubmitting}
            >
              <option value="">Select</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Graduate">Graduate</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </main>
  );
}