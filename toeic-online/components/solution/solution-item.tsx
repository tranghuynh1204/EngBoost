import React from "react";
interface SolutionItemProps {
  groups: {
    image: string;
    transcript: string;
    questions: { serial: string; correctAnswer: string }[];
  }[];
}
export const SolutionItem = ({ groups }: SolutionItemProps) => {
  return (
    <div>
      {groups.map((group, index) => (
        <div key={index}>
          <div>
            <div>{group.image}</div>
          </div>
          <div>
            <p>{group.transcript}</p>
          </div>
          <div>
            {group.questions.map((question) => (
              <div key={question.serial}>
                <div>
                  {question.serial} đáp án đúng là 
                  {question.correctAnswer}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
