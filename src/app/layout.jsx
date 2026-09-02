import { Geist, Geist_Mono, Open_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap", // Improves performance by preventing layout shifts
});

export const metadata = {
  title: "TeleMed AI",
  description: "Book appointments, consult online, get prescriptions and manage your health — all in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} font-sans antialiased`}>
          {children}
          <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
