"use client";

import { useEffect, useState } from "react";
import styles from "./admin.module.css";
import { useAuth } from "@/context/AuthContext";

type User = {
  pk: number;
  email: string;
  first_name: string;
  last_name: string;
  major: string;
  minor: string | null;
  position: string;
};

export default function Admin() {
  const { user, accessToken, isBoardMember } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [draftUsers, setDraftUsers] = useState<Record<number, Partial<User>>>({});
  const [search, setSearch] = useState("");
  const [expandedPk, setExpandedPk] = useState<number | null>(null);

  useEffect(() => {
    if (isBoardMember) fetchUsers();
  }, [user]);

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
    const original = users.find((usr) => usr.pk === u.pk);
    const positionChanged = original?.position !== editedUser.position;

    try {
      if (positionChanged && editedUser.position) {
        const endpoint = editedUser.position === "board_member" ? "promote" : "demote";

        if (endpoint === "promote" && user?.position !== "admin") {
          alert("Only admins can promote users to board members.");
          return;
        }

        const payload =
          endpoint === "promote"
            ? {
                role: "member",
                graduation_year: new Date().getFullYear() + 1,
              }
            : undefined;
        console.log("pk", u.pk)
        const res = await fetch(`/api/users/${u.pk}/${endpoint}/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: payload ? JSON.stringify(payload) : undefined,
        });

        const text = await res.text();
        console.log(`${endpoint.toUpperCase()} response:`, res.status, text);

        if (!res.ok) {
          console.error(`${endpoint.toUpperCase()} failed.`);
          return;
        }
      }

      const { first_name, last_name, major, minor } = editedUser;

      const patchRes = await fetch(`/api/users/${u.pk}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ first_name, last_name, major, minor }),
      });

      if (!patchRes.ok) {
        const text = await patchRes.text();
        console.error("PATCH failed:", text);
      }

      // Clear draft after successful update
      setDraftUsers((prev) => {
        const copy = { ...prev };
        delete copy[u.pk];
        return copy;
      });

      fetchUsers();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const deleteUser = async (pk: number) => {
    await fetch(`/api/users/${pk}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    fetchUsers();
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
                    {(["first_name", "last_name", "major", "minor", "position"] as const).map((field) => {
                      const isDropdown = field === "position";
                      const label = field.replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase());

                      return isDropdown ? (
                        <select
                          key={field}
                          className={styles.input}
                          value={editedUser.position}
                          onChange={(e) => {
                            setDraftUsers((prev) => ({
                              ...prev,
                              [u.pk]: {
                                ...prev[u.pk],
                                position: e.target.value,
                              },
                            }));
                          }}
                        >
                          <option value="user">General Member</option>
                          <option value="board_member">Board Member</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <input
                          key={field}
                          className={styles.input}
                          value={(editedUser as any)[field] || ""}
                          placeholder={label}
                          onChange={(e) => {
                            setDraftUsers((prev) => ({
                              ...prev,
                              [u.pk]: {
                                ...prev[u.pk],
                                [field]: e.target.value,
                              },
                            }));
                          }}
                        />
                      );
                    })}
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
