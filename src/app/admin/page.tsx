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

// Extend draft to support promotion payload inputs
type DraftUser = Partial<User> & {
  promotion_role?: string;
  promotion_year?: number;
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
    console.log("[Admin] Fetching users...");
    const res = await fetch("/api/users/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data: User[] = await res.json();
    console.log(`[Admin] Fetched ${data.length} users`);
    setUsers(data);
  };

  const updateUser = async (u: User) => {
    const draft = draftUsers[u.pk] || {};
    const editedUser = { ...u, ...draft };
    const { first_name, last_name, major, minor, position } = editedUser;
    const promotion_role = draft.promotion_role ?? "member";
    const promotion_year = draft.promotion_year ?? new Date().getFullYear() + 1;

    console.log(`[Admin] Attempting to update user ${u.pk}`);
    console.log("Edited user:", editedUser);

    try {
      const res = await fetch(`/api/users/${u.pk}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        console.error(`[Admin] Failed to fetch user ${u.pk} before updating.`);
        return;
      }

      const currentUserFromServer: User = await res.json();
      const positionChanged = position && currentUserFromServer.position !== position;

      if (positionChanged) {
        const endpoint = position === "board_member" ? "promote" : "demote";

        if (endpoint === "promote" && !isBoardMember) {
          console.warn("[Admin] Unauthorized attempt to promote user.");
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

        console.log(`[Admin] ${endpoint.toUpperCase()} user ${u.pk}`, payload || "(no payload)");
        const promoteRes = await fetch(`/api/users/${u.pk}/${endpoint}/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: payload ? JSON.stringify(payload) : undefined,
        });

        if (!promoteRes.ok) {
          const text = await promoteRes.text();
          console.error(`[Admin] ${endpoint.toUpperCase()} failed:`, text);
          return;
        }
      }

      console.log(`[Admin] Sending final PATCH for user ${u.pk}`);
      const patchRes = await fetch(`/api/users/${u.pk}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ first_name, last_name, major, minor, position }),
      });

      if (!patchRes.ok) {
        const text = await patchRes.text();
        console.error("[Admin] Final PATCH failed:", text);
        return;
      }

      console.log(`[Admin] Successfully updated user ${u.pk}`);
      setDraftUsers((prev) => {
        const copy = { ...prev };
        delete copy[u.pk];
        return copy;
      });

      await fetchUsers();
    } catch (err) {
      console.error("[Admin] Update failed:", err);
      setDraftUsers((prev) => ({ ...prev, [u.pk]: draft }));
    }
  };

  const deleteUser = async (pk: number) => {
    console.log(`[Admin] Deleting user ${pk}`);
    await fetch(`/api/users/${pk}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    await fetchUsers();
  };

  if (!isBoardMember) {
    console.warn("[Admin] Unauthorized access — not a board member");
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
                  onClick={() => {
                    console.log(`[Admin] Toggling user ${u.pk} section`);
                    setExpandedPk(isExpanded ? null : u.pk);
                  }}
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
                            const newPosition = e.target.value;
                            console.log(`[Admin] Draft updated for user ${u.pk} - new position: ${newPosition}`);
                            setDraftUsers((prev) => ({
                              ...prev,
                              [u.pk]: {
                                ...prev[u.pk],
                                position: newPosition,
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
                            const newVal = e.target.value;
                            console.log(`[Admin] Draft updated for user ${u.pk} - ${field}: ${newVal}`);
                            setDraftUsers((prev) => ({
                              ...prev,
                              [u.pk]: {
                                ...prev[u.pk],
                                [field]: newVal,
                              },
                            }));
                          }}
                        />
                      );
                    })}

                    {(draft.position === "board_member" || editedUser.position === "board_member") && (
                      <>
                        <input
                          className={styles.input}
                          placeholder="Role (e.g. member, president)"
                          value={draft.promotion_role || ""}
                          onChange={(e) => {
                            setDraftUsers((prev) => ({
                              ...prev,
                              [u.pk]: {
                                ...prev[u.pk],
                                promotion_role: e.target.value,
                              },
                            }));
                          }}
                        />
                        <input
                          className={styles.input}
                          placeholder="Graduation Year"
                          type="number"
                          value={draft.promotion_year || ""}
                          onChange={(e) => {
                            setDraftUsers((prev) => ({
                              ...prev,
                              [u.pk]: {
                                ...prev[u.pk],
                                promotion_year: parseInt(e.target.value),
                              },
                            }));
                          }}
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
