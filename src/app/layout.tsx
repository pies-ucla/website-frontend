import type { Metadata } from "next";
import "./globals.css";
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: "UCLA PIES",
  description: "PIES website so awesome!",
};

export default function RootLayout({
  children,
} : {
  children: React.ReactNode
}) {
return (
  <html>
    <body>
      <div className={styles.container}>
        <Navbar />
        <main className={styles.mainContent}>{children}</main>
        <Footer />
      </div>
    </body>
  </html>
);
};
