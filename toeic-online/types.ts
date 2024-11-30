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

export interface User {
  _id: string;
  name: string;
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
  user: User;
  content: string;
  replies: Comment[];
  createdAt: string;
}

export interface Message {
  user: User;
  timestamp: string;
  content: string;
  isAdmin: boolean;
}

export interface UserExam {
  _id: string;
  exam: Exam;
  startTime: string;
  duration: number;
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
  duration: number;
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

export interface Vocabulary {
  _id?: string;

  word?: string;

  mean?: string;

  image?: string;

  example?: string;

  notes?: string;

  pronunciation?: string;

  partOfSpeech?: string;

  flashcard?: Flashcard;
}

export interface Flashcard {
  _id: string;
  title: string;
  description: string;
  owner: boolean;
  vocabularyCount: number;
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
export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600); // Tính giờ
  const mins = Math.floor((seconds % 3600) / 60); // Tính phút
  const secs = seconds % 60; // Tính giây
  return `${hours < 10 ? "0" : ""}${hours}:${mins < 10 ? "0" : ""}${mins}:${
    secs < 10 ? "0" : ""
  }${secs}`;
};
import { format } from "date-fns";

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "dd/MM/yyyy HH:mm:ss");
};

export interface Statistical {
  total: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  fill: string;
}
