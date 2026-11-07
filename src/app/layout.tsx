import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { AuthProvider } from "@/context/AuthContext";
import PageLoader from "@/components/PageLoader/PageLoader";

export const metadata: Metadata = {
  title: "UCLA PIES",
  description: "PIES website so awesome!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PageLoader />
        <AuthProvider>
          <Navbar />
            {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
