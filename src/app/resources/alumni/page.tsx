"use client";

import styles from "./alumni.module.css";
import { useState } from 'react';
import Image from "next/image";

type Alumni = {
  first_name: string,
  last_name: string,
  year: number,
  major: [[string]],
  minor: [[string]],
  occupation: string,
  pie: string,
  created_time: Date,
  updated_time: Date,
}

const alumniDummyData = [
  {
    first_name: "Eric",
    last_name: "Payson",
    year: 2024,
    major: [["Bioengineering"]],
    minor: [[]],
    occupation: "PhD Student in Bioengineering at University of Washington",
    pie: 'Pumpkin',
    created_time: new Date(),
    updated_time: new Date()
  },
  {
    first_name: "Ian",
    last_name: "Galvez",
    year: 2024,
    major: [["Computer Science"]],
    minor: [[]],
    occupation: "Drifter",
    pie: 'Pumpkin',
    created_time: new Date(),
    updated_time: new Date()
  },
  {
    first_name: "Jared",
    last_name: "Velasquez",
    year: 2025,
    major: [["Computer Science and Engineering"]],
    minor: [[]],
    occupation: "Multimillionaire",
    pie: 'Pumpkin',
    created_time: new Date(),
    updated_time: new Date()
  },
  {
    first_name: "Ethan",
    last_name: "Dao",
    year: 2025,
    major: [["Computer Science"]],
    minor: [[]],
    occupation: "N/A",
    pie: 'Pumpkin',
    created_time: new Date(),
    updated_time: new Date()
  },
]
export default function Alumni() {
  const [inputValue, setInputValue] = useState('');
  const [filters, setFilters] = useState<string[]>([]);
  const filteredAlumni = alumniDummyData.filter((alum) => {
    const majors = alum.major.flat().map((m) => m.toLowerCase());
    return filters.every((filter) =>
      majors.some((major) => major.includes(filter.toLowerCase()))
    );
  });

  const applyFilter = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !filters.includes(trimmed)) {
      setFilters((prev) => [...prev, trimmed]);
      setInputValue('');
    }
  };
  
  const removeFilter = (filterToRemove: string) => {
    setFilters((prev) => prev.filter((f) => f !== filterToRemove));
  };
  
  const clearAllFilters = () => {
    setFilters([]);
    setInputValue('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Alumni</h1>

      <div className={styles.subsection}>
        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.leftTop}>
              <h1 className={styles.subHeader}>
                These successful PIES alumni are open to career-related outreach!
              </h1>
            </div>
            <div className={styles.leftBottom}>
              <div className={styles.box}>
                <b className={styles.contactText}>
                  contact <u>reaguz@g.ucla.edu</u> for alumni contact info!
                </b>
              </div>
            </div>
          </div>
          <div className={styles.right}>[Insert photo here]</div>
        </div>
      </div>

      <div style={{ width: "100%" }}>
        <h1 className={styles.dbHeader}>PIES Alumni Database:</h1>
        <hr className={styles.separator} />
        <div className={styles.grid} style={{ margin: "1.5rem", gap: '5rem' }}>
          <div className={styles.left}>
            <Image 
              src="/alumni/AlumniDBSlide.png"
              alt="Alumni DB" 
              width={1920} 
              height={1080}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
          <div className={[styles.right, styles.box].join(" ")}>
            <p className={styles.contactText}>
              Hi!<br />
              Welcome to the PIES Alumni Database!
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <h1 style={{color: 'white'}}>filter by major</h1>
        <div>
          <input
            type="text"
            placeholder="search major here"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={styles.searchInput}
          />
          <hr className={styles.separator} style={{ marginTop: '-0.5rem' }} />
          </div>
          <button className={styles.button} onClick={applyFilter}>APPLY FILTERS</button>
          <button className={styles.button} onClick={clearAllFilters}>REMOVE ALL FILTERS</button>
      </div>
      <div className={styles.activeFilters}>
        {filters.map((filter, index) => (
          <span key={index} className={styles.filterChip}>
            {filter}
            <button onClick={() => removeFilter(filter)} className={styles.removeBtn}>×</button>
          </span>
        ))}
      </div>
      {/* Display cards w/ alumni data */}
      <div className={styles.alumniGrid}>
        {filteredAlumni.map((alum, index) => (
          <div key={index} className={[styles.alumniCard, styles.alumniText].join(" ")}>
            <h1>
              {alum.first_name} {alum.last_name}
            </h1>
            <h2>UCLA Class of {alum.year}</h2>
            <h2>Major: {alum.major}</h2>
            <h2>Current occupation: {alum.occupation}</h2>
          </div>
        ))}
      </div>

    </div>
  );
}
