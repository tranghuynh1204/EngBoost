import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Section } from "@/types";
import { ScrollArea } from "../ui/scroll-area";

interface QuestionTrackerProps {
  sections: Section[];
  answeredQuestions: Record<string, string>;
  onNavigate: (questionSerial: string, index: number) => void;
  onSubmit?: () => void;
}

const QuestionTracker: React.FC<QuestionTrackerProps> = ({
  sections,
  answeredQuestions,
  onNavigate,
  onSubmit,
}) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600); // Tính giờ
    const mins = Math.floor((seconds % 3600) / 60); // Tính phút
    const secs = seconds % 60; // Tính giây
    return `${hours < 10 ? "0" : ""}${hours}:${mins < 10 ? "0" : ""}${mins}:${
      secs < 10 ? "0" : ""
    }${secs}`;
  };
  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  // console.log("a");

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
      {/* Header: Timer */}
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        <span>
          <span className="font-bold">{formatTime(count)}</span>
        </span>
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
                        className={`w-8 h-8 flex flex-col items-center justify-center border rounded-lg transition duration-200 focus:outline-none focus:ring-2 ${
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
                        <span className="text-xs font-medium text-gray-700">
                          {question.serial}
                        </span>
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
