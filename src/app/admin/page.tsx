"use client";

import { useEffect, useState } from "react";
import styles from "./admin.module.css";
import { useAuth } from "@/context/AuthContext";
import Select from "react-select";
import { Major, MajorLabels, BoardPositions, BoardPositionLabels, enumToArray } from "@/utils/enums";

type User = {
  pk: number;
  email: string;
  first_name: string;
  last_name: string;
  major: string;
  minor: string | null;
  position: string;
};

type DraftUser = Partial<User> & {
  promotion_role?: string;
  promotion_year?: number;
};

const majorOptions = enumToArray(Major).map((value) => ({
  value,
  label: MajorLabels[value] || value,
}));

const roleOptions = enumToArray(BoardPositions).map((value) => ({
  value,
  label: BoardPositionLabels[value] || value,
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

export default function Admin() {
  const { user, accessToken, isBoardMember } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [draftUsers, setDraftUsers] = useState<Record<number, DraftUser>>({});
  const [search, setSearch] = useState("");
  const [expandedPk, setExpandedPk] = useState<number | null>(null);

  useEffect(() => {
    if (isBoardMember) fetchUsers();
  }, [isBoardMember]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((u) =>
        `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  const fetchUsers = async () => {
    const res = await fetch("/api/users/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data: User[] = await res.json();
    setUsers(data);
  };

  const updateUser = async (u: User) => {
    const draft = draftUsers[u.pk] || {};
    const editedUser = { ...u, ...draft };
    const { first_name, last_name, major, minor, position } = editedUser;
    const promotion_role = draft.promotion_role ?? "member";
    const promotion_year = draft.promotion_year ?? new Date().getFullYear() + 1;

    try {
      const res = await fetch(`/api/users/${u.pk}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) return;

      const currentUserFromServer: User = await res.json();
      const positionChanged = position && currentUserFromServer.position !== position;

      if (positionChanged) {
        const endpoint = position === "board_member" ? "promote" : "demote";

        if (endpoint === "promote" && !isBoardMember) {
          alert("Only admins can promote users to board members.");
          return;
        }

        const payload =
          endpoint === "promote"
            ? {
                role: promotion_role,
                graduation_year: parseInt(String(promotion_year)),
              }
            : undefined;

        const promoteRes = await fetch(`/api/users/${u.pk}/${endpoint}/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: payload ? JSON.stringify(payload) : undefined,
        });

        if (!promoteRes.ok) return;
      }

      const patchRes = await fetch(`/api/users/${u.pk}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ first_name, last_name, major, minor, position }),
      });

      if (!patchRes.ok) return;

      setDraftUsers((prev) => {
        const copy = { ...prev };
        delete copy[u.pk];
        return copy;
      });

      await fetchUsers();
    } catch (err) {
      setDraftUsers((prev) => ({ ...prev, [u.pk]: draft }));
    }
  };

  const deleteUser = async (pk: number) => {
    await fetch(`/api/users/${pk}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    await fetchUsers();
  };

  if (!isBoardMember) {
    return (
      <div className={styles.modalBackdrop}>
        <div className={styles.modal}>
          <h2>Unauthorized</h2>
          <p>You must be a board member to access this page.</p>
          <button className={styles.button} onClick={() => (window.location.href = "/")}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Admin Panel</h1>
      <div className={styles.columns}>
        <div>
          <h2>Users</h2>
          <input
            className={styles.input}
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filteredUsers.map((u) => {
            const isExpanded = expandedPk === u.pk;
            const draft = draftUsers[u.pk] || {};
            const editedUser = { ...u, ...draft };

            return (
              <div key={u.pk} className={styles.textbox}>
                <div
                  className={styles.userHeader}
                  onClick={() => setExpandedPk(isExpanded ? null : u.pk)}
                >
                  <strong>{u.first_name} {u.last_name}</strong> — {u.email}
                  <span className={styles.expandIcon}>{isExpanded ? "▴" : "▾"}</span>
                </div>

                {isExpanded && (
                  <div className={styles.userDetails}>
                    {(["first_name", "last_name", "minor", "position"] as const).map((field) => {
                      const label = field.replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase());

                      if (field === "position") {
                        return (
                          <select
                            key={field}
                            className={styles.input}
                            value={editedUser.position}
                            onChange={(e) =>
                              setDraftUsers((prev) => ({
                                ...prev,
                                [u.pk]: { ...prev[u.pk], position: e.target.value },
                              }))
                            }
                          >
                            <option value="user">General Member</option>
                            <option value="board_member">Board Member</option>
                            <option value="admin">Admin</option>
                          </select>
                        );
                      }

                      return (
                        <input
                          key={field}
                          className={styles.input}
                          value={(editedUser as any)[field] || ""}
                          placeholder={label}
                          onChange={(e) =>
                            setDraftUsers((prev) => ({
                              ...prev,
                              [u.pk]: { ...prev[u.pk], [field]: e.target.value },
                            }))
                          }
                        />
                      );
                    })}

                    {/* Custom dropdown for major */}
                    <Select
                      styles={customSelectStyles}
                      options={majorOptions}
                      value={majorOptions.find((opt) => opt.value === editedUser.major)}
                      onChange={(selected) => {
                        if (selected) {
                          setDraftUsers((prev) => ({
                            ...prev,
                            [u.pk]: { ...prev[u.pk], major: selected.value },
                          }));
                        }
                      }}
                      placeholder="Select a major..."
                      isSearchable
                    />

                    {(draft.position === "board_member" || editedUser.position === "board_member") && (
                      <>
                        <Select
                          styles={customSelectStyles}
                          options={roleOptions}
                          value={roleOptions.find((opt) => opt.value === draft.promotion_role)}
                          onChange={(selected) => {
                            if (selected) {
                              setDraftUsers((prev) => ({
                                ...prev,
                                [u.pk]: { ...prev[u.pk], promotion_role: selected.value },
                              }));
                            }
                          }}
                          placeholder="Select a board role..."
                          isSearchable
                        />
                        <input
                          className={styles.input}
                          placeholder="Graduation Year"
                          type="number"
                          value={draft.promotion_year || ""}
                          onChange={(e) =>
                            setDraftUsers((prev) => ({
                              ...prev,
                              [u.pk]: {
                                ...prev[u.pk],
                                promotion_year: parseInt(e.target.value),
                              },
                            }))
                          }
                        />
                      </>
                    )}

                    <div className={styles.buttonRow}>
                      <button className={styles.button} onClick={() => updateUser(u)}>Save</button>
                      <button className={styles.deleteButton} onClick={() => deleteUser(u.pk)}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}