export interface UserExamResult {
  exam: any;
  correct: number;
  incorrect: number;
  skipped: number;
  result: string;
  duration: string;
  sections: {
    name: string;
    mapTagQuestion: {
      [tag: string]: {
        correct: number;
        incorrect: number;
        skipped: number;
        questions: string[];
      };
    };
    correct: number;
    incorrect: number;
    skipped: number;
  }[];
  mapQuestion: {
    [serial: string]: {
      content: string;
      options: string;
      correctAnswer: string;
      tags: string[];
      answer: string;
    };
  };
  mapGroup: {
    [id: string]: {
      documentText: string;
      audio: string;
      image: string;
    };
  };
}
