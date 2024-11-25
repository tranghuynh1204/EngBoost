import { Exam } from "@/types";
import { Clock, MessageSquare, Layers, HelpCircle } from "lucide-react";
import { AiOutlineComment } from "react-icons/ai";
import { GiSpellBook } from "react-icons/gi";
interface ExamCardProps {
  exam: Exam; // Define exam as the prop
}
const ExamCard = ({ exam }: ExamCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 w-64">
      {/* Title Section */}
      <div className="flex justify-center items-center mb-4">
        <h2 className="text-center text-lg font-bold text-gray-800">
          {exam.title}
        </h2>
      </div>
      {/* Details Section */}
      <div className="text-gray-600 text-sm mb-4 space-y-2">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span>
            <span className="font-semibold">Duration:</span> {exam.duration}{" "}
            mins
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <AiOutlineComment className="w-4 h-4 text-blue-400" />
          <span>
            <span className="font-semibold">Comments:</span> {exam.commentCount}
          </span>
        </div>
      </div>
      {/* Sections and Questions */}
      <div className="grid grid-cols-2 gap-4 text-gray-600 text-sm mb-4">
        <div className="flex items-center space-x-2">
          <GiSpellBook className="w-4 h-4 text-blue-400" />
          <span>
            <span className="font-semibold">Sections:</span> {exam.sectionCount}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-red-500" />
          <span>
            <span className="font-semibold">Questions:</span>{" "}
            {exam.questionCount}
          </span>
        </div>
      </div>
      {/* Category */}
      <div className="text-gray-600 text-sm text-center">
        <span className="inline-block bg-blue-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
          {exam.category}
        </span>
      </div>
    </div>
  );
};

export default ExamCard;
