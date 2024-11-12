export interface UserExamResult {
  correct: number;
  incorrect: number;
  skipped: number;
  result: string;
  duration: string;
  sections: {
    name: string;
    tags: string[];
    correct: number;
    incorrect: number;
    skipped: number;
  }[];
  mapTagQuestion?: {
    [tag: string]: {
      correct: number;
      incorrect: number;
      skipped: number;
      questions: string[];
    };
  };
  mapQuestion?: {
    [serial: string]: {
      content: string;
      image: string;
      options: string;
      correctAnswer: string;
      tags: string[];
      answer: string;
    };
  };
}
