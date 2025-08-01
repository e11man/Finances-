import "./globals.css";
import { ReactNode } from "react";
import Nav from "../components/Nav";

export const metadata = {
  title: "Financial Planner MVP",
  description: "Monthly-first financial planning app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen antialiased bg-background">
        <Nav />
        {children}
      </body>
    </html>
  );
}