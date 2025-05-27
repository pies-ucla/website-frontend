"use client";
import ImageSlot from "@/components/ImageSlot/ImageSlot";
import styles from "./AlumniBanner.module.css";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AlumniBanner() {
    const { isBoardMember } = useAuth(); 
    const [images, setImages] = useState({
        uncs: `/alumni/uncs.png?t=${Date.now()}`
    });

    return (
        <div>
            <h1 className={styles.header}>Alumni</h1>
            <div className={styles.subsection}>
                <div className={styles.grid}>
                    <div className={styles.left}>
                        <div className={styles.leftTop}>
                            <h1 className={styles.subHeader}>
                                These successful PIES alumni are open to career-related outreach!
                            </h1>
                        </div>
                        <div className={styles.leftBottom}>
                            <div className={styles.box}>
                                <b className={styles.contactText}>
                                contact <u>reaguz@g.ucla.edu</u> for alumni contact info!
                                </b>
                            </div>
                        </div>
                    </div>
                    <div className={styles.right} style={{ display: 'flex', justifyContent: 'center' }}>
                        <ImageSlot
                        slot="uncs"
                        src={images.uncs}
                        editable={isBoardMember}
                        targetDir="alumni"
                        onImageReplaced={(newUrl) =>
                            setImages((prev) => ({
                            ...prev,
                            uncs: `${newUrl}?t=${Date.now()}`
                            }))
                        }
                        className={styles.replaceableImage}
                        />
                    </div>
                </div>
            </div>
            <div style={{ width: "100%" }}>
                <h1 className={styles.dbHeader}>PIES Alumni Database:</h1>
                <hr className={styles.separator} />
                <div className={styles.grid} style={{ margin: "1.5rem", gap: '5rem' }}>
                <div className={styles.left}>
                    <Image
                    src="/alumni/AlumniDBSlide.png"
                    alt="Alumni DB"
                    width={1920}
                    height={1080}
                    style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain'
                    }}
                    />
                </div>
                <div className={[styles.right, styles.box].join(" ")}>
                    <p className={styles.contactText}>
                    Hi!<br />
                    Welcome to the PIES Alumni Database!
                    </p>
                </div>
                </div>
            </div>
    </div>
    )
}