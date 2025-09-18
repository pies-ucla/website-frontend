"use client";

import { useState } from 'react';
import Image from 'next/image';
import styles from './newsletter.module.css';
const API_URL =  process.env.NEXT_PUBLIC_API_URL;

export default function Newsletter() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmissionStatus({
          success: true,
          message: 'Thank you for subscribing to our newsletter!'
        });
        setName('');
        setEmail('');
      } else {
        setSubmissionStatus({
          success: false,
          message: data.error || 'Failed to subscribe. Please try again.'
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
      <h1 className={styles.title}>Newsletter</h1>
      
      <div className={styles.imageContainer}>
        <Image 
          src="/newsletter-placeholder.png" 
          alt="PIES Newsletter" 
          width={600} 
          height={300}
          className={styles.newsletterImage}
          priority={true}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "https://via.placeholder.com/600x300?text=PIES+Newsletter";
          }}
        />
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
      
      <form className={styles.subscribeForm} onSubmit={handleSubmit}>
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
        
        <button 
          type="submit" 
          className={styles.subscribeButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </main>
  );
}
