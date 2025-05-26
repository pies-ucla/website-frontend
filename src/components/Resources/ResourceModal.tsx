"use client";

import React from "react";
import styles from "./ResourceModal.module.css";

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

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.modalClose}>×</button>
        <h2>{resource.pk ? "Edit Resource" : "New Resource"}</h2>
        <input value={resource.title} onChange={e => setResource({ ...resource, title: e.target.value })} placeholder="Title" />
        <textarea value={resource.description} onChange={e => setResource({ ...resource, description: e.target.value })} placeholder="Description" />
        <input value={resource.resource_type} onChange={e => setResource({ ...resource, resource_type: e.target.value })} placeholder="Type (career/scholarship)" />
        <input type="datetime-local" value={resource.deadline} onChange={e => setResource({ ...resource, deadline: e.target.value })} />
        <input value={resource.link} onChange={e => setResource({ ...resource, link: e.target.value })} placeholder="Link" />
        <button onClick={onSubmit} className={styles.modalSubmit}>Submit</button>
      </div>
    </div>
  );
}