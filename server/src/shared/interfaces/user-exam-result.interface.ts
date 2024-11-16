export interface UserExamResult {
  exam: any;
  correct: number;
  incorrect: number;
  skipped: number;
  result: string;
  duration: string;
  mapSectionCategory: {
    [category: string]: {
      correct: number;
      questionCount: number;
    };
  };
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
    serialStart: string;
    serialEnd: string;
  }[];
  mapQuestion: {
    [serial: string]: {
      content: string;
      options: string;
      correctAnswer: string;
      tags: string[];
      answer: string;
      answerExplanation: string;
    };
  };
  mapGroup: {
    [id: string]: {
      documentText: string;
      audio: string;
      image: string;
      transcript: string;
    };
  };
}
