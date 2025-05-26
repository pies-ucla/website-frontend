"use client";

import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal/Modal';
import styles from './events.module.css';
import { useAuth } from '@/context/AuthContext';

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

function toDatetimeLocal(dateStr: string) {
  const date = new Date(dateStr);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [termIndex, setTermIndex] = useState(2); // Default: Spring 2025
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { isBoardMember } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formState, setFormState] = useState<Omit<Event, "created_time" | "updated_time">>({
    event_name: "",
    date_time: "",
    location: "",
    link: "",
    description: "",
    image_url: null,
  });

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

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      const newEvent = await res.json();
      setEvents((prev) => [...prev, newEvent]);
      closeModal();
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  const handleEdit = async () => {
    try {
      const res = await fetch(`/api/events/${formState.pk}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      const updatedEvent = await res.json();
      setEvents((prev) => prev.map(ev => (ev.pk === updatedEvent.pk ? updatedEvent : ev)));
      closeModal();
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  const handleDelete = async (eventToDelete: Event) => {
    try {
      console.log('event to delete', eventToDelete)
      await fetch(`/api/events/${eventToDelete.pk}`, { method: 'DELETE' });
      setEvents((prev) => prev.filter(ev => ev.event_name !== eventToDelete.event_name));
      setSelectedEvent(null);
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsEditing(false);
    setModalOpen(false);
    setFormState({ event_name: "", date_time: "", location: "", link: "", description: "", image_url: null });
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
        {isBoardMember && (
          <button
            className={styles.createButton}
            onClick={() => {
              setFormState({
                event_name: "",
                date_time: "",
                location: "",
                link: "",
                description: "",
                image_url: null
              });
              setIsEditing(false);
              setSelectedEvent(null);
              setModalOpen(true); // ✅ explicitly open the modal
            }}
          >
            + Create Event
          </button>
        )}
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
        <Modal isOpen={modalOpen || selectedEvent !== null} onClose={() => {
          closeModal();
          setModalOpen(false); // ✅ close modal explicitly
        }}>
        {selectedEvent && !isEditing ? (
          <div className={styles.modalContent}>
            <h1>{selectedEvent.event_name}</h1>
            <h2>{selectedEvent.description}</h2>
            <p>{new Date(selectedEvent.date_time).toLocaleString()}</p>
            <p>{selectedEvent.location}</p>

            {isBoardMember && (
              <div className={styles.modalButtons}>
                <button onClick={() => {
                  setFormState({
                    ...selectedEvent,
                    date_time: toDatetimeLocal(selectedEvent.date_time),
                  });
                  setIsEditing(true);
                  setModalOpen(true);
                }}>Edit ✎</button>
                <button onClick={() => handleDelete(selectedEvent)}>Delete 🗑</button>
              </div>
            )}
          </div>
        ) : (
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              isEditing ? handleEdit() : handleCreate();
            }}
          >
            <h2>{isEditing ? "Edit Event" : "Create Event"}</h2>
            <input required placeholder="Event Name" value={formState.event_name} onChange={(e) => setFormState({ ...formState, event_name: e.target.value })} />
            <input required type="datetime-local" value={formState.date_time} onChange={(e) => setFormState({ ...formState, date_time: e.target.value })} />
            <input required placeholder="Location" value={formState.location} onChange={(e) => setFormState({ ...formState, location: e.target.value })} />
            <input required placeholder="Link" value={formState.link} onChange={(e) => setFormState({ ...formState, link: e.target.value })} />
            <textarea required placeholder="Description" value={formState.description} onChange={(e) => setFormState({ ...formState, description: e.target.value })} />
            <input placeholder="Image URL (optional)" value={formState.image_url || ""} onChange={(e) => setFormState({ ...formState, image_url: e.target.value })} />
            <button type="submit">{isEditing ? "Save Changes" : "Create Event"}</button>
          </form>
        )}
      </Modal>
    </>
  );
}