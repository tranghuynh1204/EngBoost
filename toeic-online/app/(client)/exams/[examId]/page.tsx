// pages/exams/[examId].tsx
"use client";
import { ExamSectionInfo } from "@/components/exam/exam-section-info";
import { UserExamContainer } from "@/components/user-exam/user-exam-container";
import { Exam } from "@/types"; // Assume you have defined the Exam type here
import axios from "axios";
import { TfiTimer } from "react-icons/tfi";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { AiOutlineComment } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { GiSpellBook } from "react-icons/gi";
import { FaUserAstronaut } from "react-icons/fa6";
import { TbList, TbMessageCircleQuestion } from "react-icons/tb";
import { TbListNumbers, TbListCheck } from "react-icons/tb";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RootState } from "@/lib/store/store";
import { useSelector } from "react-redux";
import { CommentContainer } from "@/components/comment/comment-container";
import Loading from "@/components/loading";
import NotFound from "@/components/not-found";

const ExamIdPage = () => {
  const params = useParams();
  const isLogin = useSelector((state: RootState) => state.data.isLogin);
  const [exam, setExam] = useState<Exam | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [isEntireExamSelected, setIsEntireExamSelected] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exams/${params.examId}`
        );
        setExam(response.data);
      } catch {
        // Handle error if needed
      } finally {
        setIsLoading(false);
      }
    };

    if (params.examId) {
      fetchExam();
    }
  }, [params.examId]);

  const handleSelectSection = (id: string) => {
    if (selectedSections.includes(id)) {
      setSelectedSections(
        selectedSections.filter((sectionId) => sectionId !== id)
      );
    } else {
      setSelectedSections([...selectedSections, id]);
    }
  };

  const handleSelectEntireExam = () => {
    if (isEntireExamSelected) {
      setIsEntireExamSelected(false);
      setSelectedSections([]);
    } else {
      setIsEntireExamSelected(true);
      if (exam) {
        const allSectionIds = exam.sections.map((section) => section._id);
        setSelectedSections(allSectionIds);
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }
  if (!exam) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      {/* White Frame Container */}
      <div className="container mx-auto px-6 py-6 bg-white shadow-sm border border-slate-400 rounded-2xl p-6">
        {/* Exam Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="inline-block bg-slate-400 text-slate-800 text-xs px-2 py-1 rounded-full">
              #{exam.category}
            </span>
          </div>
          <div className="text-xl text-center font-bold text-gray-800 mb-4">
            {exam.title}
          </div>
        </div>
        {/* Updated Tabs using the same styling as your first project */}
        <Tabs defaultValue="1">
          <div className="flex justify-center mb-6">
            <TabsList className="flex  h-10 border bg-slate-50 border-slate-400 rounded-lg p-1">
              <TabsTrigger
                value="1"
                className="flex items-center space-x-2 py-1 px-3 text-sm font-medium text-muted-foreground  hover:text-black focus:outline-none rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:text-black "
              >
                <TbListNumbers className="w-4 h-4" />
                <span>Information</span>
              </TabsTrigger>
              {isLogin && (
                <TabsTrigger
                  value="2"
                  className="flex items-center  space-x-2 py-1 px-3 text-sm font-medium text-muted-foreground  hover:text-black focus:outline-none rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  <TbListCheck className="w-4 h-4" />
                  <span>Transcript</span>
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="1">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="bg-gradient-to-r from-slate-100 to-slate-100 p-6 border border-slate-400 rounded-md shadow-sm w-full md:w-1/2 flex flex-col items-center h-[300px] ">
                  {/* Centered Title */}
                  <h2 className="font-semibold  text-gray-800 mb-4 text-center">
                    Exam Details
                  </h2>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-3 gap-6 w-full">
                    {/* Duration */}
                    <div className="bg-white p-4 rounded-xl flex flex-col items-center">
                      {/* <TfiTimer className="text-blue-600 w-6 h-6 mb-2" /> */}
                      <span className="text-lg font-semibold text-gray-800 mb-1">
                        {exam.duration}
                      </span>
                      <div className="flex items-center gap-1">
                        <TfiTimer className="text-cyan-600 w-4 h-4" />
                        <span className="text-xs text-gray-500">Minutes</span>
                      </div>
                    </div>

                    {/* Sections */}
                    <div className="bg-white p-4 rounded-xl flex flex-col items-center">
                      {/* <GiSpellBook className="text-blue-600 w-6 h-6 mb-2" /> */}
                      <span className="text-lg font-semibold text-gray-800 mb-1">
                        {exam.sectionCount}
                      </span>
                      <div className="flex items-center gap-1">
                        <GiSpellBook className="text-cyan-600 w-4 h-4" />
                        <span className="text-xs text-gray-500">Sections</span>
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="bg-white p-4  rounded-xl  flex flex-col items-center">
                      {/* <TbMessageCircleQuestion className="text-blue-600 w-6 h-6 mb-2" /> */}
                      <span className="text-lg font-semibold text-gray-800 mb-1">
                        {exam.questionCount}
                      </span>
                      <div className="flex items-center gap-1">
                        <TbMessageCircleQuestion className="text-cyan-600 w-4 h-4" />
                        <span className="text-xs text-gray-500">Questions</span>
                      </div>
                    </div>

                    {/* Comments */}
                    <div className="bg-white p-4 rounded-xl flex flex-col items-center ">
                      {/* <AiOutlineComment className="text-blue-600 w-6 h-6 mb-2" /> */}
                      <span className="text-lg font-semibold text-gray-800 mb-1">
                        {exam.commentCount}
                      </span>
                      <div className="flex items-center gap-1">
                        <AiOutlineComment className="text-cyan-600 w-4 h-4" />
                        <span className="text-xs text-gray-500">Comments</span>
                      </div>
                    </div>

                    {/* Users */}
                    <div className="bg-white p-4 0 rounded-xl flex flex-col items-center col-span-2">
                      {/* <FaUserAstronaut className="text-blue-600 w-6 h-6 mb-2" /> */}
                      <span className="text-lg font-semibold text-gray-800 mb-1">
                        {exam.userCount}
                      </span>
                      <div className="flex items-center gap-1">
                        <FaUserAstronaut className="text-cyan-600 w-4 h-4" />
                        <span className="text-xs text-gray-500">Users</span>
                      </div>
                    </div>
                  </div>
                </div>
                {isLogin && (
                  <div className="flex-1 h-[300px] overflow-hidden">
                    <UserExamContainer examId={params.examId as string} />
                  </div>
                )}
              </div>
              <div id="exam-sections" className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Exam Sections
                </h2>
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={isEntireExamSelected}
                    onChange={handleSelectEntireExam}
                    className="mr-2"
                  />
                  <label className="text-lg text-gray-700">
                    Select All Exam Sections
                  </label>
                </div>
                <div className="flex flex-col space-y-4">
                  {exam.sections.map((section) => (
                    <ExamSectionInfo
                      id={section._id}
                      name={section.name}
                      questionCount={section.questionCount}
                      tags={section.tags}
                      key={section._id}
                      isSelected={selectedSections.includes(section._id)}
                      onSelect={handleSelectSection}
                      disabled={isEntireExamSelected}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="time-select"
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Select Practice Time:
                </label>
                <Select
                  onValueChange={(value) => setSelectedTime(value)}
                  defaultValue="0"
                >
                  <SelectTrigger id="time-select" className="w-full">
                    <SelectValue placeholder="Select Practice Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No Limit</SelectItem>
                    <SelectItem value="10">5 minutes</SelectItem>
                    <SelectItem value="600">10 minutes</SelectItem>
                    <SelectItem value="900">15 minutes</SelectItem>
                    <SelectItem value="1200">20 minutes</SelectItem>
                    <SelectItem value="1500">25 minutes</SelectItem>
                    <SelectItem value="1800">30 minutes</SelectItem>
                    <SelectItem value="2100">35 minutes</SelectItem>
                    <SelectItem value="2400">40 minutes</SelectItem>
                    <SelectItem value="2700">45 minutes</SelectItem>
                    <SelectItem value="3000">50 minutes</SelectItem>
                    <SelectItem value="3300">55 minutes</SelectItem>
                    <SelectItem value="3600">60 minutes</SelectItem>
                    <SelectItem value="3900">65 minutes</SelectItem>
                    <SelectItem value="4200">70 minutes</SelectItem>
                    <SelectItem value="4500">75 minutes</SelectItem>
                    <SelectItem value="4800">80 minutes</SelectItem>
                    <SelectItem value="5100">85 minutes</SelectItem>
                    <SelectItem value="5400">90 minutes</SelectItem>
                    <SelectItem value="5700">95 minutes</SelectItem>
                    <SelectItem value="6000">100 minutes</SelectItem>
                    <SelectItem value="6300">105 minutes</SelectItem>
                    <SelectItem value="6600">110 minutes</SelectItem>
                    <SelectItem value="6900">115 minutes</SelectItem>
                    <SelectItem value="7200">120 minutes</SelectItem>
                    <SelectItem value="7500">125 minutes</SelectItem>
                    <SelectItem value="7800">130 minutes</SelectItem>
                    <SelectItem value="8100">135 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-center items-center mb-6">
                <Button
                  className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
                  disabled={
                    !isEntireExamSelected && selectedSections.length === 0
                  }
                >
                  <Link
                    href={{
                      pathname: `/exams/${params.examId}/practice`,
                      query: {
                        time: selectedTime,
                        sectionId: selectedSections,
                      },
                    }}
                  >
                    Start practice
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
          {isLogin && (
            <TabsContent value="2">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                  <Button
                    variant="link"
                    className="text-blue-600 hover:underline"
                  >
                    <Link href={`/exams/${params.examId}/solutions`}>
                      View Exam Answer
                    </Link>
                  </Button>
                </div>
                <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Answers for Exam Sections
                  </h2>
                  <ul className="space-y-2">
                    {exam.sections.map((section) => (
                      <li
                        key={section._id}
                        className="flex items-center justify-between p-3 border rounded-md bg-white hover:shadow-sm"
                      >
                        <div className="text-gray-700">
                          <span className="font-medium">{section.name}</span>
                        </div>
                        <Button
                          variant="link"
                          className="text-blue-600 hover:underline text-sm font-semibold"
                        >
                          <Link
                            href={`/exams/${params.examId}/parts/${section._id}/solutions`}
                          >
                            Transcript
                          </Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
      <CommentContainer />
    </div>
  );
};

export default ExamIdPage;
