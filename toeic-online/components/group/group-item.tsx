import { Group } from "@/types";
import React from "react";
import Image from "next/image";

interface GroupItemProps {
  group: Group;
}
export const GroupItem = ({ group }: GroupItemProps) => {
  return (
    <div>
      {group.audio && (
        <audio controls className="w-full mb-4" preload="none">
          <source src={group.audio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
      {group.image && (
        <Image
          src={group.image}
          layout="intrinsic"
          width="500"
          height="0"
          sizes="100vw"
          className="h-auto mb-4"
          alt="Group Image"
          loading="lazy"
        />
      )}
      {group.documentText && (
        <div
          className="mb-4 text-gray-700"
          dangerouslySetInnerHTML={{ __html: group.documentText }}
        ></div>
      )}
      {group.transcript && (
        <div dangerouslySetInnerHTML={{ __html: group.transcript }}></div>
      )}
    </div>
  );
};
