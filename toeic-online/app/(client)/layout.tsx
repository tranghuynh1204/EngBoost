import { AnswerModal } from "@/components/modals/answer-modal";
import { CreateVocabularyModal } from "@/components/modals/create-vocabulary-modal";
import { UpdateVocabularyModal } from "@/components/modals/update-vocabulary-modal";
import { Toaster } from "@/components/ui/toaster";

import { UpdateFlashcardModal } from "@/components/modals/update-flashcard-modal";
import { CreateFlashcardModal } from "@/components/modals/create-flashcard-modal";
import Header from "@/components/Header";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <main>
        {children}
        <Toaster />
        <AnswerModal />
        <CreateVocabularyModal />
        <UpdateVocabularyModal />
        <UpdateFlashcardModal />
        <CreateFlashcardModal />
      </main>
    </div>
  );
}
