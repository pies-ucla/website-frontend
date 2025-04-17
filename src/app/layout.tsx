import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { AuthProvider } from "@/context/AuthContext";

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
        <AuthProvider>
          <Navbar />
            {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
