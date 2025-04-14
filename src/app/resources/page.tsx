import styles from "./resources.module.css";

export default function Resources() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Resources</h1>
      <div className={styles.subsection}>
        <h1 className={styles.subHeader}>ACADEMIC RESOURCES</h1>
        <hr className={styles.separator} />
        <div className={styles.columns}>
            <div></div>
            <div>
                <h1>Undergraduate Research Portal</h1>
                <p>Want to get into research? A great place to start is the Undergraduate Research Portal! You can find numerous projects in both the STEM and humanities fields, and see if they have paid positions, give out academic credit, or are volunteer work. Click the following link for more information UCLA Undergraduate Research Portal.<br/>
                If you want need more advice on finding research, try out the Undergraduate Research Center! They have a page on Finding a Project and Mentor and offer Workshops year round.</p>
            </div>
        </div>
        <hr className={styles.separator} />
      </div>
      <div className={styles.subsection}>
        <h1 className={styles.subHeader}>LIFE AND HEALTH RESOURCES</h1>
        <hr className={styles.separator} />
        <div className={styles.columns}>
            <div></div>
            <div>
                <h1>UCLA CAPS</h1>
                <p>If you are ever in need of any help or are struggling with your mental health, CAPS resources are available to all UCLA students.
Crisis counseling is available 24/7 and can be reached at (310)825-0768. More emergency resources can be found through this link CAPS | Emergency Services.<br/>
Additionally, CAPS Services include individual and/or group therapy and drop-in hours, among others. Click here for more information on their services.</p>
            </div>
        </div>
        <hr className={styles.separator} />
      </div>
      <div className={styles.subsection}>
        <h1 className={styles.subHeader}>SCHOLARSHIPS</h1>
        <hr className={styles.separator} />
        <div className={styles.columns}>
            <div></div>
            <div>
                <h1>UCLA Scholarship Center (CSSE)</h1>
                <p>If you want to search for more scholarships funded by UCLA, visit the UCLA Scholarship Research Center! They link the different departments across campus that have scholarships available. The Center provides workshops Weeks 2-10 throughout the school year on how to apply for scholarships, draft personal statements, etc. Schedule and RSVP for a workshop here. Additionally, they offer individual counseling to help with searching for scholarships and 1:1 writing appointments to assist with personal statements and essays.</p>
            </div>
        </div>
        <hr className={styles.separator} />
      </div>
    </div>
  );
}
