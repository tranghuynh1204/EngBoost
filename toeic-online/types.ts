export interface Exam {
  _id: string;
  title: string;
  duration: number;
  category: string;
  questionCount: number;
  sectionCount: number;
  commentCount: number;
  userCount: number;
  sections: Section[];
}

export interface Section {
  _id: string;
  name: string;
  tags: [];
  questionCount: number;
  groups: Group[];
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
  exam: Exam;
  startTime: string;
  duration: string;
  result: string;
  sections: Section[];
}

export interface Question {
  _id: string;
  serial: string;
  content: string;
  options: string[];
  correctAnswer: string;
  tags: string[];
  answer: string;
  group: string;
  answerExplanation: string;
}

export interface Group {
  _id: string;
  documentText: string;
  audio: string;
  image: string;
  transcript: string;
  questions: Question[];
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
    serialStart: number;
    serialEnd: number;
    correct: number;
    incorrect: number;
    skipped: number;
  }[];
  mapQuestion: MapQuestion;
  mapGroup: MapGroup;
  mapSectionCategory: {
    [category: string]: {
      correct: number;
      questionCount: number;
    };
  };
}
export interface MapQuestion {
  [serial: string]: Question;
}
export interface MapGroup {
  [id: string]: Group;
}
export const mapOption: { [key: number]: string } = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
};
