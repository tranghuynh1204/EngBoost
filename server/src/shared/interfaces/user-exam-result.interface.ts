export interface UserExamResult {
  correct: number;
  incorrect: number;
  skipped: number;
  sections: {
    name: string;
    tags: string[];
    correct: number;
    incorrect: number;
    skipped: number;
  }[];
  mapQuestion?: {
    [tag: string]: {
      correct: number;
      incorrect: number;
      skipped: number;
      questions: {
        content: string;
        options: string;
        correctAnswer: string;
        serial: string;
        tag: string;
        answer: string;
      }[];
    };
  };
}
