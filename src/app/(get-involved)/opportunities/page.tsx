import Image from "next/image";
import styles from "./opportunities.module.css";

export default function Resources() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Opportunities</h1>
      <div className={styles.subsection}>
        <h1 className={styles.subHeader}>PIEYANIHAN AND MENTORSHIP</h1>
        <hr className={styles.separator} />
        <div className={styles.columns}>
            <div>
              <Image
                src="/opportunities/pieyanihan.png"
                alt="Childish Goombinoes!" 
                width={1920} 
                height={1080}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '5px',
                  marginTop: '1rem'
                }}
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
              <Image
                src="/opportunities/board.jpg"
                alt="PIES Board and interns" 
                width={1920} 
                height={1080}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '5px',
                  marginTop: '1rem'
                }}
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
      <div className={styles.subsection}>
        <h1 className={styles.subHeader}>PIES PROJECTS</h1>
        <hr className={styles.separator} />
        <div className={styles.columns}>
            <div></div>
            <div>
                <h1>Liwanag (Tagalog App Project)</h1>
                <p>The Liwanag App Project team is currently working on building a language learning app for anyone who wants to learn Tagalog!<br/>
                Open Positions: Testers<br />
                Apply Here!</p>
            </div>
        </div>
        <hr className={styles.separator} />
      </div>
    </div>
  );
}
