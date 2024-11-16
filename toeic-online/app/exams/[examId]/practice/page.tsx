// pages/exams/[examId]/practice/[practiceSessionId]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Exam } from "@/types"; // Define your types accordingly

const PracticeExamPage = () => {
  const { practiceSessionId } = useParams();
  const [exam, setExam] = useState<Exam | null>(null);
  const [userAnswers, setUserAnswers] = useState<{
    [questionId: string]: string;
  }>({});

  useEffect(() => {
    const fetchPracticeSession = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exams/practice/${practiceSessionId}`
        );
        setExam(response.data);
      } catch (error) {
        console.error("Error fetching practice session data:", error);
      }
    };

    if (practiceSessionId) {
      fetchPracticeSession();
    }
  }, [practiceSessionId]);

  const handleAnswerChange = (questionId: string, selectedOption: string) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmitAnswers = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/exams/practice/${practiceSessionId}/submit`,
        { answers: userAnswers }
      );
      // Redirect to results page or show a success message
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  if (!exam) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{exam.title}</h1>
      {exam.sections.map((section) => (
        <div key={section._id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{section.name}</h2>
          {section.groups.map((group) => (
            <div key={group._id} className="mb-4">
              {/* Display group content */}
              {group.audio && (
                <audio controls>
                  <source src={group.audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
              {group.image && (
                <img src={group.image} alt="Group Image" className="mb-2" />
              )}
              {group.documentText && (
                <p className="mb-2">{group.documentText}</p>
              )}
              {group.transcript && (
                <p className="italic text-gray-600 mb-2">{group.transcript}</p>
              )}
              {/* Display questions */}
              {group.questions.map((question) => (
                <div key={question._id} className="mb-4 p-4 border rounded">
                  <p className="mb-2">{question.content}</p>
                  {question.options.map((option, index) => (
                    <div key={index} className="mb-1">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={question._id}
                          value={option}
                          checked={userAnswers[question._id] === option}
                          onChange={() =>
                            handleAnswerChange(question._id, option)
                          }
                          className="form-radio"
                        />
                        <span className="ml-2">{option}</span>
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
      <button
        onClick={handleSubmitAnswers}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit Answers
      </button>
    </div>
  );
};

export default PracticeExamPage;
