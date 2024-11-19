import React from "react";
import { Button } from "../ui/button";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Section } from "@/types";
import { ScrollArea } from "../ui/scroll-area";

interface QuestionTrackerProps {
  sections: Section[];
  answeredQuestions: Record<string, string>;
  onNavigate: (questionSerial: string, index: number) => void;
  onSubmit: () => void;
  timeLeft: number | null;
  elapsedTime?: number;
}

const QuestionTracker: React.FC<QuestionTrackerProps> = ({
  sections,
  answeredQuestions,
  onNavigate,
  onSubmit,
  timeLeft,
  elapsedTime,
}) => {
  // Helper function to format timeLeft into MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
      {/* Header: Timer */}
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        {timeLeft !== null ? (
          <span>
            Thời gian còn lại:{" "}
            <span className="font-bold">{formatTime(timeLeft)}</span>
          </span>
        ) : (
          <span>
            Thời gian làm bài:{" "}
            <span className="font-bold">{formatTime(elapsedTime || 0)}</span>
          </span>
        )}
      </h2>

      {/* Submit Button */}
      <div className="mb-6">
        <Button
          onClick={onSubmit}
          className="w-full flex items-center justify-center px-4 py-2 border border-white bg-black text-white rounded-lg shadow hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Nộp bài
        </Button>
      </div>

      {/* Questions Grid with Scroll */}
      <ScrollArea className="h-[500px] rounded-md border p-3">
        {" "}
        {/* Set a fixed height */}
        <div className="flex flex-col space-y-4">
          {sections.map((section, sIndex) => (
            <div key={section._id}>
              <h3 className="text-xl font-semibold mb-2">{section.name}</h3>
              <div className="grid grid-cols-4 gap-2">
                {section.groups.map((group, index) => (
                  <React.Fragment key={index}>
                    {group.questions.map((question) => (
                      <button
                        key={question.serial}
                        onClick={() => onNavigate(question.serial, sIndex)}
                        className={`w-full h-12 flex flex-col items-center justify-center border rounded-lg transition duration-200 focus:outline-none focus:ring-2 ${
                          answeredQuestions[question.serial]
                            ? "border-green-500 bg-green-100 hover:bg-green-200 focus:ring-green-500"
                            : "border-gray-400 bg-gray-200 hover:bg-gray-300 focus:ring-gray-500"
                        }`}
                        aria-label={`Question ${question.serial}, ${
                          answeredQuestions[question.serial]
                            ? "answered"
                            : "not answered"
                        }`}
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {question.serial}
                        </span>
                        {answeredQuestions[question.serial] ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mt-1" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-gray-500 mt-1" />
                        )}
                      </button>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default QuestionTracker;
