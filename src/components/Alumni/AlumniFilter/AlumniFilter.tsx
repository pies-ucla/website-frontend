"use client";

import styles from "./AlumniFilter.module.css";

type AlumniFilterProps = {
  inputValue: string;
  setInputValue: (val: string) => void;
  filters: string[];
  applyFilter: () => void;
  removeFilter: (val: string) => void;
  clearAllFilters: () => void;
};

export default function AlumniFilter({
  inputValue,
  setInputValue,
  filters,
  applyFilter,
  removeFilter,
  clearAllFilters,
}: AlumniFilterProps) {
  return (
    <>
      <div className={styles.filterBar}>
        <h1 style={{ color: "white" }}>filter by major</h1>
        <div>
          <input
            type="text"
            placeholder="search major here"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={styles.searchInput}
          />
          <hr className={styles.separator} style={{ marginTop: "-0.5rem" }} />
        </div>
        <button className={styles.button} onClick={applyFilter}>
          APPLY FILTERS
        </button>
        <button className={styles.button} onClick={clearAllFilters}>
          REMOVE ALL FILTERS
        </button>
      </div>

      <div className={styles.activeFilters}>
        {filters.map((filter, index) => (
          <span key={index} className={styles.filterChip}>
            {filter}
            <button
              onClick={() => removeFilter(filter)}
              className={styles.removeBtn}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </>
  );
}