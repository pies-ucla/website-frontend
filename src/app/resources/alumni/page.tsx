import styles from "./alumni.module.css";

export default function Alumni() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Members Only</h1>

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
          <div className={styles.right}>[Insert photo here]</div>
        </div>
      </div>

      <div style={{ width: "100%" }}>
        <h1 className={styles.dbHeader}>PIES Alumni Database:</h1>
        <hr className={styles.separator} />
        <div className={styles.grid} style={{ margin: "1.5rem" }}>
          <div className={styles.left}>[INSERT IMAGE HERE]</div>
          <div className={[styles.right, styles.box].join(" ")}>
            <p className={styles.contactText}>
              Hi!<br />
              Welcome to the PIES Alumni Database!
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <h1 style={{color: 'white'}}>filter by major</h1>
        <div>
          <input
            type="text"
            placeholder="search major here"
            className={styles.searchInput}
          />
          <hr className={styles.separator} style={{marginTop: '-0.5rem'}}/>
        </div>
        <button className={styles.button}>APPLY FILTERS</button>
        <button className={styles.button}>REMOVE ALL FILTERS</button>
      </div>
    </div>
  );
}
