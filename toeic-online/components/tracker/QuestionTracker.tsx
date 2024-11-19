// components/tracker/QuestionTracker.tsx

import React from "react";
import { Button } from "../ui/button"; // Ensure Button is correctly exported
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid"; // Import Heroicons
import { Section } from "@/types";

interface QuestionTrackerProps {
  sections: Section[];
  answeredQuestions: Record<string, string>;
  onNavigate: (questionSerial: string, index: number) => void;
  onSubmit: () => void;
}

const QuestionTracker: React.FC<QuestionTrackerProps> = ({
  sections,
  answeredQuestions,
  onNavigate,
  onSubmit,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
      {/* Header */}
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Question Tracker
      </h2>

      {/* Submit Button */}
      <div className="mb-6">
        <Button
          onClick={onSubmit}
          className="w-full flex items-center justify-center px-4 py-2 border border-white bg-black text-white rounded-lg shadow hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Submit Answers
        </Button>
      </div>

      {/* Questions Grid */}
      <div className="flex flex-col space-y-4 flex-grow overflow-y-auto">
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
    </div>
  );
};

export default QuestionTracker;
