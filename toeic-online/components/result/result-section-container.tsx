import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultSectionItem } from "./result-section-item";

interface ResultSectionContainerProps {
  sections: {
    name: string;
    mapTagQuestion: {
      [tag: string]: {
        correct: number;
        incorrect: number;
        skipped: number;
        questions: string[];
      };
    };
    correct: number;
    incorrect: number;
    skipped: number;
  }[];
}

export const ResultSectionContainer = ({
  sections,
}: ResultSectionContainerProps) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h4 className="text-xl font-semibold text-gray-800 mb-4">
        Phân tích chi tiết
      </h4>

      <Tabs defaultValue={sections[0].name} className="w-full">
        <TabsList className="flex flex-wrap gap-2 mb-4 bg-gray-100 p-2 rounded-lg">
          {sections.map((section) => (
            <TabsTrigger
              key={section.name}
              value={section.name}
              className="px-4 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {section.name || "Section"}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent
            key={section.name}
            value={section.name}
            className="p-4 bg-gray-50 rounded-lg"
          >
            <ResultSectionItem
              correct={section.correct}
              incorrect={section.incorrect}
              skipped={section.skipped}
              mapTagQuestion={section.mapTagQuestion}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
