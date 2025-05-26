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
  const [newUser, setNewUser] = useState<Partial<User>>({});
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
    const data = await res.json();
    setUsers(data);
  };

  const updateUser = async (u: User) => {
    const original = users.find((usr) => usr.pk === u.pk);
    const positionChanged = original?.position !== u.position;

    try {
      // Step 1: Promote or demote if position changed
      if (positionChanged && u.position) {
        const endpoint = u.position === "board_member" ? "promote" : "demote";

        // Only admins can promote
        if (endpoint === "promote" && user?.position !== "admin") {
          alert("Only admins can promote users to board members.");
          return;
        }

        const payload =
          endpoint === "promote"
            ? {
                role: "member", // You can make this editable in the UI later
                graduation_year: new Date().getFullYear() + 1, // Default or editable
              }
            : undefined;

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

      // Step 2: Patch the rest of the user data (excluding position)
      const { first_name, last_name, major, minor } = u;

      const res = await fetch(`/api/users/${u.pk}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ first_name, last_name, major, minor }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("PATCH failed:", text);
      }

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
                        value={u.position}
                        onChange={(e) => {
                          const updated = users.map((usr) =>
                            usr.pk === u.pk ? { ...usr, position: e.target.value } : usr
                          );
                          setUsers(updated);
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
                        value={u[field] || ""}
                        placeholder={label}
                        onChange={(e) => {
                          const updated = users.map((usr) =>
                            usr.pk === u.pk ? { ...usr, [field]: e.target.value } : usr
                          );
                          setUsers(updated);
                        }}
                      />
                    );
                  })}
                    <div className={styles.buttonRow}>
                      <button className={styles.button} onClick={() => updateUser(u)}>
                        Save
                      </button>
                      <button className={styles.deleteButton} onClick={() => deleteUser(u.pk)}>
                        Delete
                      </button>
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
