import "./globals.css";
import AuthProvider from "@/components/layout/AuthProvider";

export const metadata = {
  title: {
    default:  "InterviewIQ — AI Interview Coach",
    template: "%s | InterviewIQ",
  },
  description:
    "Practice real job interviews with AI. Get instant feedback on every answer. Build the confidence to land your next role.",
  keywords: [
    "interview practice",
    "AI interview coach",
    "job interview preparation",
    "interview feedback",
    "behavioral interview",
    "technical interview",
  ],
  authors:  [{ name: "InterviewIQ" }],
  creator:  "InterviewIQ",
  metadataBase: new URL(
    process.env.NEXTAUTH_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    type:        "website",
    locale:      "en_NG",
    url:         process.env.NEXTAUTH_URL,
    title:       "InterviewIQ — AI Interview Coach",
    description: "Practice real job interviews with AI. Get instant per-answer feedback.",
    siteName:    "InterviewIQ",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "InterviewIQ — AI Interview Coach",
    description: "Practice real job interviews with AI. Get instant per-answer feedback.",
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-navy-950 text-text-primary font-body antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}