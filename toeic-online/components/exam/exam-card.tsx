import { Exam } from "@/types";

interface ExamCardProps {
  exam: Exam; // Define exam as the prop
}
const ExamCard = ({ exam }: ExamCardProps) => {
  return (
    <div>
      <div>{exam.title}</div>
      <div>
        <div>{exam.duration}</div>
        <div>{exam.commentCount}</div>
      </div>
      <div>
        {exam.sectionCount}| {exam.questionCount}
      </div>
      <div>{exam.category}</div>
    </div>
  );
};

export default ExamCard;
