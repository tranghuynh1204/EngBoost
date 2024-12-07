import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Section } from "@/types";
import { ScrollArea } from "./ui/scroll-area";

interface QuestionTrackerProps {
  sections: Section[];
  onNavigate: (questionSerial: string, index: number) => void;
  answeredQuestionsRef: Record<string, string>;
}

const QuestionTracker = forwardRef(
  (
    { sections, onNavigate, answeredQuestionsRef }: QuestionTrackerProps,
    ref
  ) => {
    const [answeredQuestions, setAnsweredQuestions] = useState<
      Record<string, string>
    >(answeredQuestionsRef ?? {});
    const callMe = (serial: string) => {
      setAnsweredQuestions({
        ...answeredQuestions,
        [serial]: "1",
      });
    };

    useImperativeHandle(ref, () => ({
      callMe,
    }));
    return (
      <div>
        {/* Questions Grid with Scroll */}
        <ScrollArea className="h-[542px] rounded-md border p-3">
          {/* Set a fixed height */}
          <div className="flex flex-col space-y-3">
            {sections.map((section, sIndex) => (
              <div key={section._id}>
                <h3 className="text-lg font-semibold mb-2">{section.name}</h3>
                <div className="grid grid-cols-6 gap-1">
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
  }
);
QuestionTracker.displayName = "QuestionTracker";
export default QuestionTracker;
