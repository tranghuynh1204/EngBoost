export interface Exam {
  _id: string;
  title: string;
  duration: number;
  category: string;
  questionCount: number;
  sectionCount: number;
  commentCount: number;
  userCount: number;
  sections: { _id: string; name: string; tags: []; questionCount: number }[];
}

export interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  content: string;
  replies: Comment[];
  createdAt: string;
}

export interface UserExam {
  _id: string;
  startTime: string;
  duration: string;
  result: string;
}

export interface QuestionAnswer {
  serial?: string;
  content: string;
  image: string;
  options: string;
  correctAnswer: string;
  tags: string[];
  answer: string;
}
export interface UserExamResult {
  exam: {
    _id: string;
    title: string;
  };
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
    [serial: string]: QuestionAnswer;
  };
}
