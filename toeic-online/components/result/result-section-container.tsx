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
    <div className="container border border-slate-400 rounded-xl mx-auto px-6 py-4">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">
        Detailed Analysis
      </h4>

      <Tabs defaultValue={sections[0].name} >
      <div className="flex justify-center mb-6">
        <TabsList className="flex  h-10 border bg-emerald-50 border-slate-400 rounded-lg p-3">
          {sections.map((section) => (
            <TabsTrigger
              key={section.name}
              value={section.name}
              className="flex items-center space-x-2 py-1 px-3 text-sm font-medium text-muted-foreground  hover:text-black focus:outline-none rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:text-black "
            >
              {section.name || "Section"}
            </TabsTrigger>
          ))}
        </TabsList>
        </div>

        {sections.map((section) => (
          <TabsContent
            key={section.name}
            value={section.name}
            className="p-4 bg-slate-50 rounded-lg"
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
