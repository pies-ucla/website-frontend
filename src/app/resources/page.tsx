"use client";

import styles from "./resources.module.css";
import { useState } from "react";

type Resource = {
  resource_type: string;
  title: string;
  description: string;
  deadline: string;
  link: string;
};

const dummyResources: Resource[] = [
  {
    resource_type: "career",
    title: "Tech Resume Review",
    description: "Submit your resume for personalized feedback from industry professionals.",
    deadline: "2025-07-05T23:59:00Z",
    link: "https://example.com/resume-review"
  },
  {
    resource_type: "career",
    title: "Summer Internship at PIES Inc.",
    description: "Applications are open for our 2025 summer internship cohort.",
    deadline: "2025-07-15T12:00:00Z",
    link: "https://example.com/internship"
  },
  {
    resource_type: "career",
    title: "PIES Leadership Summit",
    description: "A two-day conference focused on leadership in STEM fields.",
    deadline: "2025-08-20T09:00:00Z",
    link: "https://example.com/summit"
  },
  {
    resource_type: "career",
    title: "LinkedIn Optimization Workshop",
    description: "Learn how to optimize your LinkedIn profile for recruiters.",
    deadline: "2025-09-10T20:00:00Z",
    link: "https://example.com/linkedin-workshop"
  },
  {
    resource_type: "career",
    title: "AI Job Interview Simulator",
    description: "Practice tech interviews with AI-powered simulations.",
    deadline: "2025-10-01T12:00:00Z",
    link: "https://example.com/ai-interview"
  },
  {
    resource_type: "career",
    title: "Tech Career Fair Fall 2025",
    description: "Meet recruiters from top tech companies and startups.",
    deadline: "2025-10-10T09:00:00Z",
    link: "https://example.com/career-fair"
  },
  {
    resource_type: "career",
    title: "Networking for Engineers Workshop",
    description: "Learn how to build your professional network effectively.",
    deadline: "2025-10-15T14:00:00Z",
    link: "https://example.com/networking-workshop"
  },
  {
    resource_type: "scholarship",
    title: "Future Engineers Scholarship",
    description: "A scholarship for students pursuing engineering degrees.",
    deadline: "2025-08-01T17:00:00Z",
    link: "https://example.com/scholarship"
  },
  {
    resource_type: "scholarship",
    title: "Diversity in Tech Scholarship",
    description: "Supports underrepresented students in tech fields.",
    deadline: "2025-09-01T11:00:00Z",
    link: "https://example.com/diversity-scholarship"
  },
  {
    resource_type: "scholarship",
    title: "Women in STEM Grant",
    description: "Funding for women pursuing STEM degrees.",
    deadline: "2025-09-20T18:00:00Z",
    link: "https://example.com/women-stem-grant"
  },
  {
    resource_type: "scholarship",
    title: "First-Gen Scholars Program",
    description: "Resources and scholarships for first-generation students.",
    deadline: "2025-10-01T13:00:00Z",
    link: "https://example.com/first-gen"
  }
];

function ResourceCard({ title, description, deadline, link }: Resource) {
  return (
    <div className={styles.card}>
      <h2>{title}</h2>
      <p>{description}</p>
      <p><strong>Deadline:</strong> {new Date(deadline).toLocaleString()}</p>
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
  const careerResources = dummyResources.filter(r => r.resource_type === "career");
  const scholarshipResources = dummyResources.filter(r => r.resource_type === "scholarship");

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