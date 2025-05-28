"use client";
import Navbar from '@/components/Navbar/Navbar';
import QuickLinks from '@/components/QuickLinks/QuickLinks';

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      {/* <QuickLinks /> */}
    </>
  );
}
