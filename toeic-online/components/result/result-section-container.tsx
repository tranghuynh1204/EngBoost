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
    <div>
      <h4>Phân tích chi tiết</h4>
      <Tabs defaultValue={sections[0].name} className="w-[400px]">
        <TabsList>
          {sections.map((section) => (
            <TabsTrigger key={section.name} value={section.name}>
              {section.name || "Section"}
            </TabsTrigger>
          ))}
        </TabsList>
        {sections.map((section) => (
          <TabsContent key={section.name} value={section.name}>
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
