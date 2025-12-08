import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/organisms";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CCS Online Payment - Gordon College",
  description: "Online Membership Payment System for Gordon College CCS Student Organizations - ELITES, SPECS, and IMAGES",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ToastProvider>
            <Header />
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
