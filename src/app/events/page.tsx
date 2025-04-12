import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './events.module.css';

export default function Events() {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const numWeeks = 10;
  const totalDays = numWeeks * 7;
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - today.getDay()); // start from last Sunday

  const dates = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.header}>Events</h1>

        <div className={styles.calendarWrapper}>
          {/* Week numbers column */}
          <div className={styles.weekColumn}>
            <div className={styles.weekHeader}></div>
            {Array.from({ length: numWeeks }).map((_, i) => (
                <div key={i} className={styles.weekCell}>
                    {i + 1}
                </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className={styles.calendar}>
            {daysOfWeek.map((day) => (
              <div key={day} className={styles.dayHeader}>{day}</div>
            ))}
            {dates.map((date, idx) => (
              <div key={idx} className={styles.dateCell}>
                <div className={styles.eventText}>Event A</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}