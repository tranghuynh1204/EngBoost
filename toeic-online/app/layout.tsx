import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import StoreProvider from "./store-provider";
import { AnswerModal } from "@/components/modals/answer-modal";
import { CreateVocabularyModal } from "@/components/modals/create-vocabulary-modal";
import { UpdateVocabularyModal } from "@/components/modals/update-vocabulary-modal";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StoreProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Header />
          {children}
          <Toaster />
          <AnswerModal />
          <CreateVocabularyModal />
          <UpdateVocabularyModal />
        </body>
      </StoreProvider>
    </html>
  );
}
