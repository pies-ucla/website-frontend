"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Modal from '@/components/Modal/Modal';
import styles from './events.module.css';

type Event = {
  event_name: string;
  date_time: string;
  location: string;
  link: string;
  description: string;
  image_url?: string | null;
  created_time: string;
  updated_time: string;
};

// edit these to match the proper date!
// align term start dates with Monday, Week 1
const TERMS = ["Fall 2024", "Winter 2025", "Spring 2025"];
const termStartDates: { [term: string]: string } = {
  "Fall 2024": "2024-09-23T18:00:00Z",
  "Winter 2025": "2025-01-06T18:00:00Z",
  "Spring 2025": "2025-03-31T18:00:00Z"
};

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [termIndex, setTermIndex] = useState(2); // Default: Spring 2025
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
      const fetchEvents = async () => {
        try {
          const res = await fetch('/api/events');
          const data = await res.json();
          setEvents(data);
        } catch (err) {
          console.error("Failed to fetch board:", err);
        }
      };
  
      fetchEvents();
  }, []);

  const handleLeft = () => {
    setTermIndex((prev) => (prev > 0 ? prev - 1 : TERMS.length - 1));
  };

  const handleRight = () => {
    setTermIndex((prev) => (prev < TERMS.length - 1 ? prev + 1 : 0));
  };

  const selectedTerm = TERMS[termIndex];
  const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const numWeeks = 10;
  const totalDays = numWeeks * 7;

  const startDate = new Date(termStartDates[selectedTerm]);
  const dayOfWeek = startDate.getDay(); // 0 (Sun) - 6 (Sat)

  const offset = (dayOfWeek + 7) % 7; // Days since Monday
  startDate.setDate(startDate.getDate() - offset);

  const dates = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + totalDays);

  const visibleEvents = events.filter((event) => {
    const eventDate = new Date(event.date_time);
    return eventDate >= startDate && eventDate < endDate;
  });

  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.header}>Events</h1>

        <div className={styles.termSelector}>
          <div className={styles.triangle} onClick={handleLeft} data-dir="left" />
          <span className={styles.termText}>{selectedTerm}</span>
          <div className={styles.triangle} onClick={handleRight} data-dir="right" />
        </div>

        <div className={styles.calendarWrapper}>
          <div className={styles.weekColumn}>
            <div className={styles.weekHeader}></div>
            {Array.from({ length: numWeeks }).map((_, i) => (
              <div key={i} className={styles.weekCell}>
                {i + 1}
              </div>
            ))}
          </div>

          <div className={styles.calendar}>
            {daysOfWeek.map((day) => (
              <div key={day} className={styles.dayHeader}>{day}</div>
            ))}
            {dates.map((date, idx) => {
              const dateKey = date.toISOString().split("T")[0];
              const eventsOnThisDay = visibleEvents.filter(event =>
                event.date_time.startsWith(dateKey)
              );
              return (
                <div key={idx} className={styles.dateCell}>
                  <div className={styles.eventList}>
                    {eventsOnThisDay.map((event, eidx) => (
                      <div
                        key={eidx}
                        className={styles.eventText}
                        onClick={() => setSelectedEvent(event)}
                      >
                        {event.event_name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modal */}
      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
        {selectedEvent && (
          <div className={styles.modalContent}>
            <h1>{selectedEvent.event_name}</h1>
            <h2>{selectedEvent.description}</h2>
            <p>{new Date(selectedEvent.date_time).toLocaleString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}</p>
            <p>{selectedEvent.location}</p>
          </div>
        )}
      </Modal>
    </>
  );
}