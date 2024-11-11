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
