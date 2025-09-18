"use client";

import styles from "./resources.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ResourceModal from "@/components/Resources/ResourceModal";
// import { ResourceType, ResourceTypeLabels, enumToArray } from "@/utils/enums";
// import Select from "react-select";
const API_URL =  process.env.NEXT_PUBLIC_API_URL;

type Resource = {
  pk?: number;
  resource_type: string;
  title: string;
  description: string;
  deadline: string;
  link: string;
};

function getLocalDatetimeString() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

function toLocalDatetimeString(isoDateStr: string): string {
  const date = new Date(isoDateStr);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
}

function sortByDeadline(resources: Resource[]) {
  return [...resources].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
}

function ResourceCard({
  title,
  description,
  deadline,
  link,
  onEdit,
  onDelete,
}: Resource & { onEdit?: () => void; onDelete?: () => void }) {
  return (
    <div className={styles.card}>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>
        <strong>Deadline:</strong>{" "}
        {new Date(deadline).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>
      <a href={link} target="_blank" rel="noopener noreferrer">Apply</a>
      {onEdit && <button className={styles.button} onClick={onEdit}>Edit ✎</button>}
      {onDelete && <button className={styles.button} onClick={onDelete}>Delete 🗑</button>}
    </div>
  );
}

function PaginatedCards({
  resources,
  itemsPerPage,
  onEdit,
  onDelete,
}: {
  resources: Resource[];
  itemsPerPage: number;
  onEdit?: (res: Resource) => void;
  onDelete?: (pk: number) => void;
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(resources.length / itemsPerPage);
  const current = resources.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <>
      <div className={styles.cardsContainer}>
        {current.map((res, i) => (
          <ResourceCard
            key={res.pk || i}
            {...res}
            onEdit={onEdit ? () => onEdit(res) : undefined}
            onDelete={onDelete ? () => onDelete(res.pk!) : undefined}
          />
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
  const { user, loading, isBoardMember, isAdmin } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchResources = async () => {
    try {
      const res = await fetch(`${API_URL}}/api/resources`);
      const data = await res.json();
      const now = new Date();
      if (Array.isArray(data)) {
        setResources(data.filter((r) => new Date(r.deadline) > now));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (!loading && user) fetchResources();
  }, [loading, user]);

  const handleSaveResource = async () => {
    if (!editingResource) return;

    const method = editingResource.pk ? "PATCH" : "POST";
    const url = editingResource.pk
      ? `/api/resources/${editingResource.pk}`
      : "/api/resources";

    // convert deadline to UTC ISO
    const payload = {
      ...editingResource,
      deadline: new Date(editingResource.deadline).toISOString(),
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      await fetchResources();
      setShowModal(false);
      setEditingResource(null);
    } else {
      console.error("Failed to save resource:", await res.text());
    }
  };


  const handleDelete = async (pk: number) => {
    await fetch(`${API_URL}/api/resources/${pk}`, { method: "DELETE" });
    await fetchResources();
  };

  const careerResources = sortByDeadline(resources.filter((r) => r.resource_type === "career"));
  const scholarshipResources = sortByDeadline(resources.filter((r) => r.resource_type === "scholarship"));

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Resources</h1>

      {(isBoardMember || isAdmin) && (
        <div className={styles.actionBar}>
          <button
            className={styles.button}
            onClick={() => {
              setEditingResource({
                title: "",
                description: "",
                deadline: getLocalDatetimeString(),
                resource_type: "career",
                link: "",
              });
              setShowModal(true);
            }}
          >
            + Add Resource
          </button>
        </div>
      )}

      <ResourceModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingResource(null);
        }}
        resource={editingResource}
        setResource={setEditingResource}
        onSubmit={handleSaveResource}
      />

      <div className={styles.subsection}>
        <h2 className={styles.subHeader}>CAREER</h2>
        <hr className={styles.separator} />
        <PaginatedCards
          resources={careerResources}
          itemsPerPage={3}
          onEdit={
            (isBoardMember || isAdmin)
              ? (res) => {
                  setEditingResource({
                    ...res,
                    deadline: toLocalDatetimeString(res.deadline),
                  });
                  setShowModal(true);
                }
              : undefined
          }
          onDelete={(isBoardMember || isAdmin) ? handleDelete : undefined}
        />
      </div>

      <div className={styles.subsection}>
        <h2 className={styles.subHeader}>SCHOLARSHIPS</h2>
        <hr className={styles.separator} />
        <PaginatedCards
          resources={scholarshipResources}
          itemsPerPage={3}
          onEdit={
            (isBoardMember || isAdmin)
              ? (res) => {
                  setEditingResource(res);
                  setShowModal(true); // <-- Add this
                }
              : undefined
          }
          onDelete={(isBoardMember || isAdmin) ? handleDelete : undefined}
        />
      </div>
    </div>
  );
}
