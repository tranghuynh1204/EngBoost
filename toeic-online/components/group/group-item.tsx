import { Group } from "@/types";
import React from "react";
import Image from "next/image";

interface GroupItemProps {
  group: Group;
}

export const GroupItem = ({ group }: GroupItemProps) => {
  return (
    <div className="space-y-6">
      {/* Audio Player */}
      {group.audio && (
        <audio
          controls
          className="w-full bg-gray-50 rounded-lg p-2 shadow border border-gray-200"
        >
          <source src={group.audio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}

      {/* Image */}
      {group.image && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md border">
          <Image
            src={group.image}
            layout="intrinsic"
            width="500"
            height="0"
            sizes="100vw"
            className="object-cover"
            alt="Group Image"
            loading="lazy"
          />
        </div>
      )}

      {/* Document Text */}
      {group.documentText && (
        <div
          className="bg-white p-4 rounded-lg shadow border text-gray-800"
          dangerouslySetInnerHTML={{ __html: group.documentText }}
        ></div>
      )}

      {/* Transcript */}
      {group.transcript && (
        <div
          className="bg-gray-100 p-4 rounded-lg shadow border text-gray-800"
          dangerouslySetInnerHTML={{ __html: group.transcript }}
        ></div>
      )}
    </div>
  );
};
