import { Exam } from "@/types";
import { Clock, MessageSquare, Layers, HelpCircle } from "lucide-react";
import { AiOutlineComment } from "react-icons/ai";
import { GiSpellBook } from "react-icons/gi";
import { FiUsers } from "react-icons/fi";
import { TbUserStar } from "react-icons/tb";
interface ExamCardProps {
  exam: Exam; // Define exam as the prop
}
const ExamCard = ({ exam }: ExamCardProps) => {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-400 transition-transform transform hover:scale-105 hover:shadow-lg hover:border-slate-600 duration-300 w-[230px] h-[215px] ease-in-out">
      <div className="text-center mb-3">
        <h2 className="text-md font-semibold text-gray-800">{exam.title}</h2>
      </div>
      <div className="text-gray-600 text-xs space-y-2">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-cyan-600" />
          <span>
            <span className="font-semibold">Duration:</span> {exam.duration}{" "}
            mins
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-cyan-600" />
          <span>
            <span className="font-semibold">Question:</span>{" "}
            {exam.questionCount}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <GiSpellBook className="w-4 h-4 text-cyan-600" />
          <span>
            <span className="font-semibold">Section:</span> {exam.sectionCount}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <AiOutlineComment className="w-4 h-4 text-cyan-600" />
          <span>
            <span className="font-semibold">Comment:</span> {exam.commentCount}
          </span>
        </div>

        <div className="flex items-center space-x-2  text-xs">
          <TbUserStar className="w-4 h-4 text-cyan-600" />
          <span>
            <span className="font-semibold">User: </span> {exam.userCount}
          </span>
        </div>
      </div>
      <div className="text-center mt-2">
        <span className="inline-block bg-cyan-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
          {exam.category}
        </span>
      </div>
    </div>
  );
};

export default ExamCard;
