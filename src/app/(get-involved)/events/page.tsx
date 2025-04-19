"use client";

import React, { useState } from 'react';
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

const TERMS = ["Fall 2024", "Winter 2025", "Spring 2025"];

const termStartDates: { [term: string]: string } = {
  "Fall 2024": "2024-09-26T18:00:00Z",
  "Winter 2025": "2025-01-06T18:00:00Z",
  "Spring 2025": "2025-03-31T18:00:00Z"
};

const eventDummyData: Event[] = [
  {
    event_name: "Fall Kickoff",
    date_time: "2024-09-30T18:00:00Z",
    location: "Kerckhoff Patio",
    link: "N/A",
    description: "Welcome Back Bash",
    created_time: "2024-09-01T18:00:00Z",
    updated_time: "2024-09-01T18:00:00Z"
  },
  {
    event_name: "Winter Social",
    date_time: "2025-01-10T18:00:00Z",
    location: "Ackerman Grand Ballroom",
    link: "N/A",
    description: "Chill Night",
    created_time: "2025-01-01T18:00:00Z",
    updated_time: "2025-01-01T18:00:00Z"
  },
  {
    event_name: "GM #1",
    date_time: "2025-04-07T18:00:00Z",
    location: "Kaplan 135",
    link: "N/A",
    description: "Balikbayan Box Macgyver",
    created_time: "2025-04-01T18:00:00Z",
    updated_time: "2025-04-01T18:00:00Z"
  },
  {
    event_name: "GM #1",
    date_time: "2025-04-07T18:00:00Z",
    location: "Kaplan 135",
    link: "N/A",
    description: "Balikbayan Box Macgyver",
    created_time: "2025-04-01T18:00:00Z",
    updated_time: "2025-04-01T18:00:00Z"
  },
  {
    event_name: "GM #1",
    date_time: "2025-04-07T18:00:00Z",
    location: "Kaplan 135",
    link: "N/A",
    description: "Balikbayan Box Macgyver",
    created_time: "2025-04-01T18:00:00Z",
    updated_time: "2025-04-01T18:00:00Z"
  },
  {
    event_name: "GM #1",
    date_time: "2025-04-07T18:00:00Z",
    location: "Kaplan 135",
    link: "N/A",
    description: "Balikbayan Box Macgyver",
    created_time: "2025-04-01T18:00:00Z",
    updated_time: "2025-04-01T18:00:00Z"
  }
];

export default function Events() {
  const [termIndex, setTermIndex] = useState(2); // Default: Spring 2025
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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

  const rawTermStart = new Date(termStartDates[selectedTerm]);
  const startDate = new Date(rawTermStart);
  const day = startDate.getDay() + 1;
  const offset = (day + 6) % 7;
  startDate.setDate(startDate.getDate() - offset);

  const dates = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + totalDays);

  const visibleEvents = eventDummyData.filter((event) => {
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