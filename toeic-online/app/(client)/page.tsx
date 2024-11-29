"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios, { AxiosResponse } from "axios";
import { Exam, UserExam } from "@/types";
import ExamCard from "@/components/exam/exam-card";
import UserExamCard from "@/components/user-exam-card";
import { ChatWidget } from "@/components/chat/chat-widget";

const Home = () => {
  const [recentlyAttemptedExams, setRecentlyAttemptedExams] = useState<
    UserExam[]
  >([]);
  const [recentlyCreatedExams, setRecentlyCreatedExams] = useState<Exam[]>([]);

  // Fetch recently attempted exams and created exams
  useEffect(() => {
    const fetchRecentlyAttemptedExams = async () => {
      try {
        const response: AxiosResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user-exams/new`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setRecentlyAttemptedExams(response.data || []);
      } catch (error) {}
    };

    const fetchRecentlyCreatedExams = async () => {
      try {
        const response: AxiosResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exams/new`
        );
        setRecentlyCreatedExams(response.data || []);
      } catch (error) {
        console.error("Error fetching recently created exams:", error);
      }
    };

    fetchRecentlyAttemptedExams();
    fetchRecentlyCreatedExams();
  }, []);

  return (
    <div className="min-h-screen bg-[rgb(251,249,241)]">
      <ChatWidget />
      <header className="bg-gradient-to-r from-[rgb(146,199,207)] to-[rgb(170,215,217)] text-[rgb(53,47,68)] py-12">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg lg:text-xl mb-6">
            Ready to continue your TOEIC journey? Here are your recent
            activities and new exams to explore.
          </p>
          <Link
            href="/exams"
            className="bg-[rgb(229,225,218)] text-[rgb(53,47,68)] px-6 py-3 rounded-lg shadow-md hover:bg-gray-200 transition-transform transform hover:scale-105"
          >
            Explore All Exams
          </Link>
        </div>
      </header>
      {/* Recently Attempted Exams */}
      <section className="py-12 bg-[rgb(229,225,218)]">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-bold text-[rgb(53,47,68)] mb-6">
            Recently Attempted Exams
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyAttemptedExams.length > 0 ? (
              recentlyAttemptedExams.map((userExam) => (
                <Link
                  key={userExam._id} // Use the userExamId here
                  href={`/exams/${userExam.exam._id}/result/${userExam._id}`} // exam._id and userExamId
                  className="block"
                >
                  <UserExamCard key={userExam._id} userExam={userExam} />
                </Link>
              ))
            ) : (
              <p className="text-gray-600">
                You haven’t attempted any exams yet. Start one now!
              </p>
            )}
          </div>
        </div>
      </section>
      {/* Recently Created Exams */}
      <section className="py-12 bg-[rgb(251,249,241)]">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-bold text-[rgb(53,47,68)] mb-6">
            Recently Created Exams
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyCreatedExams.length > 0 ? (
              recentlyCreatedExams.map((exam) => (
                <Link
                  key={exam._id}
                  href={`/exams/${exam._id}`}
                  className="block"
                >
                  <ExamCard exam={exam} />
                </Link>
              ))
            ) : (
              <p className="text-gray-600">
                No new exams available. Check back later!
              </p>
            )}
          </div>
        </div>
      </section>
      {/* Quick Links Section */}
      <section className="py-12 bg-[rgb(229,225,218)]">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-bold text-[rgb(53,47,68)] mb-6">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              href="/exams"
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold text-[rgb(53,47,68)]">
                Practice Tests
              </h3>
              <p className="text-gray-600 mt-2">
                Simulate real TOEIC tests to sharpen your skills.
              </p>
            </Link>
            <Link
              href="/study-materials"
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold text-[rgb(53,47,68)]">
                Study Materials
              </h3>
              <p className="text-gray-600 mt-2">
                Access resources for listening, reading, and grammar.
              </p>
            </Link>
            <Link
              href="/vocabulary"
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold text-[rgb(53,47,68)]">
                Vocabulary Builder
              </h3>
              <p className="text-gray-600 mt-2">
                Expand your vocabulary with interactive tools.
              </p>
            </Link>
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-r from-[rgb(146,199,207)] to-[rgb(170,215,217)] text-[rgb(53,47,68)] text-center">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-bold mb-4">Keep Improving!</h2>
          <p className="mb-6">
            Stay consistent with your practice and watch your TOEIC score soar!
          </p>
          <Link
            href="/dashboard"
            className="bg-[rgb(229,225,218)] text-[rgb(53,47,68)] px-6 py-3 rounded-lg shadow-md hover:bg-gray-200 transition-transform transform hover:scale-105"
          >
            Go to Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
