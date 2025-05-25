"use client";

import styles from "./resources.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Resource = {
  resource_type: string;
  title: string;
  description: string;
  deadline: string;
  link: string;
};

function ResourceCard({ title, description, deadline, link }: Resource) {
  return (
    <div className={styles.card}>
      <h2>{title}</h2>
      <p>{description}</p>
      <p><strong>Deadline:</strong> {new Date(deadline).toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })}</p>
      <a href={link} target="_blank" rel="noopener noreferrer">Apply</a>
    </div>
  );
}

function PaginatedCards({ resources, itemsPerPage }: { resources: Resource[]; itemsPerPage: number }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(resources.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const current = resources.slice(start, start + itemsPerPage);

  return (
    <>
      <div className={styles.cardsContainer}>
        {current.map((res, index) => (
          <ResourceCard key={index} {...res} />
        ))}
      </div>
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={page === i + 1 ? styles.activePage : styles.pageBtn}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </>
  );
}

export default function Resources() {
  const { user, loading } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  useEffect(() => {
    if (!loading && user) {
        const fetchResources = async () => {
            try {
            const res = await fetch('/api/resources');
            const data = await res.json();
            if (Array.isArray(data)) {
                const now = new Date();
            const upcomingResources = data.filter((r: Resource) => new Date(r.deadline) > now);
                setResources(upcomingResources);
            } else {
                console.error("Expected array but got:", data);
            }
            } catch (err) {
            console.error("Failed to fetch resources:", err);
            }
        };
  
        fetchResources();
    }
  }, []);

  const careerResources = resources.filter(r => r.resource_type === "career");
  const scholarshipResources = resources.filter(r => r.resource_type === "scholarship");

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Resources</h1>

      <div className={styles.subsection}>
        <h1 className={styles.subHeader}>CAREER</h1>
        <hr className={styles.separator} />
        <PaginatedCards resources={careerResources} itemsPerPage={3} />
        <hr className={styles.separator} />
      </div>

      <div className={styles.subsection}>
        <h1 className={styles.subHeader}>SCHOLARSHIPS</h1>
        <hr className={styles.separator} />
        <PaginatedCards resources={scholarshipResources} itemsPerPage={3} />
        <hr className={styles.separator} />
      </div>
    </div>
  );
}