"use client";

import styles from "./projects.module.css";
import { useAuth } from "@/context/AuthContext";
import ImageSlot from "@/components/ImageSlot/ImageSlot";
import { useState } from "react";

export default function Resources() {
  const { isBoardMember, isAdmin } = useAuth();
  const [images, setImages] = useState({
      pieyanihan: `/opportunities/pieyanihan.png?t=${Date.now()}`,
      board: `/opportunities/board.png?t=${Date.now()}`
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Projects</h1>
      <div className={styles.subsection}>
        <h1 className={styles.subHeader}>Pilipinos in Engaging Engineering Projects (PEEP)</h1>
        <hr className={styles.separator} />
        <div className={styles.columns}>
            <div>
              <ImageSlot
                slot="pieyanihan"
                src={images.pieyanihan}
                editable={isBoardMember || isAdmin}
                targetDir="opportunities"
                onImageReplaced={(newUrl) =>
                  setImages((prev) => ({
                    ...prev,
                    pieyanihan: `${newUrl}?t=${Date.now()}` // 👈 force refresh
                  }))
                }
                className={styles.replaceableImage}
              />
            </div>
            <div>
                <h1>TIGER</h1>
                <p>peformative matcha robot</p>
            </div>
        </div>
      </div>
      <div className={styles.subsection}>
        <h1 className={styles.subHeader}>CS Project</h1>
        <hr className={styles.separator} />
        <div className={styles.columns}>
            <div>
              <ImageSlot
                slot="board"
                src={images.board}
                editable={isBoardMember || isAdmin}
                targetDir="opportunities"
                onImageReplaced={(newUrl) =>
                  setImages((prev) => ({
                    ...prev,
                    board: `${newUrl}?t=${Date.now()}` // 👈 force refresh
                  }))
                }
              />
            </div>
            <div>
                <h1>Placeholder</h1>
                <p>bleh</p>
            </div>
        </div>
        <hr className={styles.separator} />
        <h1 className={styles.subHeader}>Past Projects</h1>
        <hr className={styles.separator} />
        <div className={styles.columns}>
            <div>
              <ImageSlot
                slot="board"
                src={images.board}
                editable={isBoardMember || isAdmin}
                targetDir="opportunities"
                onImageReplaced={(newUrl) =>
                  setImages((prev) => ({
                    ...prev,
                    board: `${newUrl}?t=${Date.now()}` // 👈 force refresh
                  }))
                }
              />
            </div>
            <div>
                <h1>Lipad</h1>
                <p>bleh</p>
            </div>
          </div>
            
        <div className={styles.columns}>
            <div>
                <h1>Mabuhive</h1>
                <p>bleh</p>
            </div>
            <div>
              <ImageSlot
                slot="board"
                src={images.board}
                editable={isBoardMember || isAdmin}
                targetDir="opportunities"
                onImageReplaced={(newUrl) =>
                  setImages((prev) => ({
                    ...prev,
                    board: `${newUrl}?t=${Date.now()}` // 👈 force refresh
                  }))
                }
              />
            </div>

        </div>
        <hr className={styles.separator} />
      </div>
    </div>
  );
}
