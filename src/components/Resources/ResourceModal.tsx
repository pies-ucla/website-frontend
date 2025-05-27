"use client";

import React from "react";
import Select from "react-select";
import styles from "./ResourceModal.module.css";
import { ResourceType, ResourceTypeLabels, enumToArray } from "@/utils/enums";

type Resource = {
  pk?: number;
  resource_type: string;
  title: string;
  description: string;
  deadline: string;
  link: string;
};

export default function ResourceModal({
  isOpen,
  onClose,
  resource,
  setResource,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource;
  setResource: (r: Resource) => void;
  onSubmit: () => void;
}) {
  if (!isOpen) return null;

  const resourceTypeOptions = enumToArray(ResourceType).map((value) => ({
    value,
    label: ResourceTypeLabels[value] || value,
  }));

  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: "white",
      border: "2px solid var(--off-yellow)",
      padding: "2px",
      borderRadius: "10px",
      fontSize: "1rem",
      fontFamily: "var(--font-normal)",
      color: "var(--primary-red)",
      boxShadow: state.isFocused ? "0 0 0 2px var(--off-yellow)" : "none",
      "&:hover": {
        borderColor: "var(--off-yellow)",
      },
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#999",
      opacity: 0.8,
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "var(--primary-red)",
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: "white",
      border: "1px solid var(--off-yellow)",
      borderRadius: "10px",
      zIndex: 1000,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#e4b8a5"
        : state.isFocused
        ? "#f7e7b5"
        : "white",
      color: "#b83f3b",
      fontFamily: "var(--font-normal)",
      padding: "0.5rem 1rem",
      cursor: "pointer",
    }),
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.modalClose}>
          ×
        </button>
        <h2>{resource.pk ? "Edit Resource" : "New Resource"}</h2>

        <input
          value={resource.title}
          onChange={(e) =>
            setResource({ ...resource, title: e.target.value })
          }
          placeholder="Title"
        />

        <textarea
          value={resource.description}
          onChange={(e) =>
            setResource({ ...resource, description: e.target.value })
          }
          placeholder="Description"
        />

        <Select
          styles={customSelectStyles}
          options={resourceTypeOptions}
          value={resourceTypeOptions.find(
            (opt) => opt.value === resource.resource_type
          )}
          onChange={(selected) => {
            if (selected) {
              setResource({ ...resource, resource_type: selected.value });
            }
          }}
          placeholder="Type (career/scholarship)"
          isSearchable
        />

        <input
          type="datetime-local"
          value={resource.deadline}
          onChange={(e) =>
            setResource({ ...resource, deadline: e.target.value })
          }
        />

        <input
          value={resource.link}
          onChange={(e) =>
            setResource({ ...resource, link: e.target.value })
          }
          placeholder="Link"
        />

        <button onClick={onSubmit} className={styles.modalSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
