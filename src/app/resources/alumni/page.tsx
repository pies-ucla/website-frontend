"use client";

import styles from "./alumni.module.css";
import { useState } from 'react';
import AlumniBanner from "@/components/Alumni/AlumniBanner/AlumniBanner";
import AlumniFilter from "@/components/Alumni/AlumniFilter/AlumniFilter";

function formatMajor(enumStr: string): string {
  const namePart = enumStr.replace(/^(ba|bs|undeclared)_/, '');
  return namePart
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

type Alumni = {
  pk?: number;
  first_name: string;
  last_name: string;
  year: number;
  major: string;
  minor?: string;
  occupation: string;
  pie?: string;
  created_time?: Date;
  updated_time?: Date;
};

const EXAMPLE_ALUMNI: Alumni[] = [
  {
    pk: 1,
    first_name: 'Jane',
    last_name: 'Doe',
    year: 2021,
    major: 'ba_economics',
    minor: 'Statistics',
    occupation: 'Product Manager at Google',
  },
  {
    pk: 2,
    first_name: 'John',
    last_name: 'Smith',
    year: 2019,
    major: 'bs_computer_science',
    occupation: 'Software Engineer at Meta',
  },
  {
    pk: 3,
    first_name: 'Maria',
    last_name: 'Garcia',
    year: 2020,
    major: 'ba_political_science',
    minor: 'Public Affairs',
    occupation: 'Legal Associate at Latham & Watkins',
  },
  {
    pk: 4,
    first_name: 'Wei',
    last_name: 'Chen',
    year: 2022,
    major: 'bs_mathematics',
    occupation: 'Data Scientist at Netflix',
  },
];

export default function Alumni() {
  const [alumni] = useState<Alumni[]>(EXAMPLE_ALUMNI);
  const [inputValue, setInputValue] = useState('');
  const [filters, setFilters] = useState<string[]>([]);

  const filteredAlumni = alumni.filter((alum) =>
    filters.every((filter) =>
      alum.major.toLowerCase().includes(filter.toLowerCase())
    )
  );

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
      <AlumniBanner />
      <AlumniFilter
        inputValue={inputValue}
        setInputValue={setInputValue}
        filters={filters}
        applyFilter={applyFilter}
        removeFilter={removeFilter}
        clearAllFilters={clearAllFilters}
      />

      <div className={styles.alumniGrid}>
        {filteredAlumni.map((alum, index) => (
          <div key={index} className={[styles.alumniCard, styles.alumniText].join(" ")}>
            <h1>
              {alum.first_name} {alum.last_name}
            </h1>
            <h2>UCLA Class of {alum.year}</h2>
            <h2>Major: {formatMajor(alum.major)}</h2>
            <h2>Current occupation: {alum.occupation}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
