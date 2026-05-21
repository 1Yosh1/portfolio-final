import type { Metadata } from "next";
import { Space_Grotesk, Special_Elite, JetBrains_Mono } from "next/font/google";
import ThreeWarningFilter from "@/components/ui/ThreeWarningFilter";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});

const specialElite = Special_Elite({
  subsets: ["latin"],
  variable: "--font-gothic",
  weight: "400",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Eyoas Zewd | 3D Portfolio",
  description:
    "Full-Stack Engineer & Security Architect — building high-fidelity interfaces and explainable risk systems. Interactive 3D portfolio.",
  keywords: ["portfolio", "full-stack", "security", "React", "Three.js", "Next.js"],
  authors: [{ name: "Eyoas Zewd", url: "https://github.com/1Yosh1" }],
  openGraph: {
    title: "Eyoas Zewd | 3D Portfolio",
    description: "An immersive Tim Burton-style 3D portfolio experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${specialElite.variable} ${jetbrainsMono.variable}`}>
      <body className="text-[#e8e0d0] overflow-hidden">
        <ThreeWarningFilter />
        {children}
      </body>
    </html>
  );
}
