"use client";

import styles from "./opportunities.module.css";
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
      <h1 className={styles.header}>Opportunities</h1>
      <div className={styles.subsection}>
        <h1 className={styles.subHeader}>PIEYANIHAN AND MENTORSHIP</h1>
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
                <h1>Pieyanihan Families</h1>
                <p>PIEyanihans are inspired by the Filipino custom of Bayanihan, where villagers would help one another relocate their bahay-kubos, which demonstrates the spirit of providing support, assistance, and community for one another.<br/>
                {/* remember to add link for Pieyanihan Rolling Application */}
                You can join a family at any time! Fill out this link so we can learn more about you and match you into a family: Pieyanihan Rolling Application.</p>
            </div>
        </div>
        <hr className={styles.separator} />
      </div>
      <div className={styles.subsection}>
        <h1 className={styles.subHeader}>INTERNSHIP PROGRAM</h1>
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
                <h1>Board Internships</h1>
                <p>Interested in joining PIES Board? Apply for the Internship Program! For you guys to gain leadership experience through shadowing board members and later on being able to do your own tasks, which could include facilitating events or helping plan those events! Overall, you will also be learning the core values of PIES and how we apply them in our leadership to succeed!<br/>
                {/* remember to add link for Internship Application */}
                Applications for Winter/Spring 2025: 24/25 Internship Application
                </p>
            </div>
        </div>
        <hr className={styles.separator} />
      </div>
    </div>
  );
}
