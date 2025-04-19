'use client';

import { useState } from 'react';
import styles from './board.module.css';

type BoardMember = {
  user: string;
  role: string;
  description?: string | null;
  graduation_year: number;
  pie?: string | null;
  linkedin?: string | null;
  resume?: string | null;
  profile_picture?: string | null;
}

const boardMemberDummy = [
  {
    user: "Irene Cruise",
    role: "president",
    description: "I was initially attracted to PIES because it was so niche yet fit my identity so perfectly! I stayed in PIES because the community is so fun, care free, and lovable! Everyone will welcome you with open arms and allow you to open up and be comfortable with who you are!",
    graduation_year: 2025,
    pie: "Ube Pie",
    linkedin: "",
    resume: "",
    profile_picture: "/board/president.png"
  },
  {
    user: "David Tabora",
    role: "internal_vice_president",
    description: "At first I joined PIES because I wanted to make more Filipino friends that were in engineering. Although I accomplished that, what made me stay was how everyone was so open and welcoming and I made life long friends because of that.",
    graduation_year: 2025,
    pie: "Peach Mango Pie",
    linkedin: "",
    resume: "",
    profile_picture: "/board/internal_vice_president.png"
  },
  {
    user: "Tristan Lopez",
    role: "external_vice_president",
    description: "I have been in PIES since my first year (shoutout PIES seniors). I instantly felt at home with how welcoming everyone was. Compared to all the other spaces I've visited which were really clique-y and intimidating, PIES was a breath of fresh air. Every time I return I receive that same feeling every time.",
    graduation_year: 2025,
    pie: "Banana Cream Pie",
    linkedin: "",
    resume: "",
    profile_picture: "/board/external_vice_president.png"
  },
  {
    user: "Reanna Guzman",
    role: "alumni_industry_relations",
    description: "Before I found PIES, I was looking for an organization with other engineering/STEM majors and another space for those who had a Filipino background like mine. After stumbling across PIES at EAF my freshman year, I was happy to realize that these two interests of mine could be found combined in a single club!",
    graduation_year: 2025,
    pie: "Apple/Peach Pie with Vanilla Bean Ice Cream",
    linkedin: "",
    resume: "",
    profile_picture: "/board/alumni_industry_relations.png"
  },
  {
    user: "Brielle Mailed",
    role: "mentorship_coordinator",
    description: "The PIES community has a deep appreciation for the people around them; they all genuinely want to connect with others and make newcomers feel welcome. I had no problem integrating into the space despite being on the more reserved side when I first started college. I was also drawn to the passion PIES people had for the club and their careers. Many members had the work-life balance I was looking for. Since meeting PIES, my college experience became so much brighter and more exciting. And this sentiment is what made me want to stay.",
    graduation_year: 2026,
    pie: "Apple/Peach Pie with Vanilla Bean Ice Cream",
    linkedin: "",
    resume: "",
    profile_picture: "/board/mentorship_coordinator.png"
  },
  {
    user: "Rafael Abalos",
    role: "secretary",
    description: "I joined PIES because in my freshman year, I wanted to join both a STEM (or Chemistry-oriented club) and Pilipino club. Luckily at EAF, I remember hearing someone shout “Hey you! Are you Filipino?!” And I remember listening to them as they told about what PIES is. Fortunately for me, it was not only both a Pilipino and STEM org, but everyone there was also pretty chill and all the events were really fun. Best decision of my life :)",
    graduation_year: 2025,
    pie: "Apple Pie",
    linkedin: "",
    resume: "",
    profile_picture: "/board/secretary.png"
  },
]

function getYearLevel(graduationYear: number): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0 = January, 5 = June, 11 = December

  // If it's before June, treat it as the previous academic year
  const academicYear = currentMonth < 6 ? currentYear - 1 : currentYear;

  const diff = graduationYear - academicYear;

  const yearMap: { [key: number]: string } = {
    0: "Just graduated! :,)",
    1: "4th year",
    2: "3rd year",
    3: "2nd year",
    4: "1st year"
  };

  return yearMap[diff] || `${Math.max(5 - diff, 1)}th+ year`;
}

export default function BoardPage() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Our Board</h1>
      <div className={styles.columns}>
        {boardMemberDummy.map((member, idx) => (
          <div className={styles.textbox} key={idx}>
            <div className={styles.boardContainer}>
              <div className={styles.boardMask}>
                <img
                  src={member.profile_picture || '/default-profile.png'}
                  alt={member.user}
                  className={styles.boardPhoto}
                />
              </div>
              <img
                src="/pie-tin.png"
                alt="Frame"
                className={styles.boardFrameImage}
              />
            </div>

            <h1 className={styles.role}>{member.role.replaceAll('_', ' ').toUpperCase()}</h1>
            <h1 className={styles.name}>{member.user}</h1>
            {/* may need to implement major later */}
            <h2
              className={styles.major}
              onClick={() => setExpandedIdx((prev) => (prev === idx ? null : idx))}
            >
              {getYearLevel(member.graduation_year)}
              <span className={styles.arrow}>
                {expandedIdx === idx ? ' ▲' : ' ▼'}
              </span>
            </h2>

            {expandedIdx === idx && member.description && (
              <>
                <p className={styles.content}>
                  <u>Favorite Pie: </u>
                  {member.pie || 'Favorite Pie Unknown'} <br /><br />
                  <u>Why did you join PIES?</u><br />
                  {member.description}
                </p>
              </>
            )}
          </div>
        ))}

        {/* Static boxes at the end */}
        <div>
        </div>
        <div className={styles.textbox}>
    <div className={styles.boardContainer}>
      <div className={styles.boardMask}>
        <img
          src='/board/pierre.png'
          alt='Pierre!'
          className={styles.boardPhoto}
        />
      </div>
      <img
        src="/pie-tin.png"
        alt="Frame"
        className={styles.boardFrameImage}
      />
    </div>

    <h1 className={styles.role}>Mascot</h1>
    <h1 className={styles.name}>Pierre D'Pioneer</h1>

    <h2 className={styles.major}>
      <u>Year:</u> Hmm...a bear never tells his secrets!
    </h2>

    <p className={styles.content}>
      <u>Why did you join PIES?</u><br />
      Some very nice PIES alumni adopted me from Build-a-Bear, but it has been great to have many amazing PIES members take care of me over the years!
    </p>
  </div>
      </div>
    </div>
  );
}
