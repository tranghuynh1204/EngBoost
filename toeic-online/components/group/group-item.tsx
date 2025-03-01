import { Group } from "@/types";
import React from "react";
import Image from "next/image";

interface GroupItemProps {
  group: Group;
}

export const GroupItem = ({ group }: GroupItemProps) => {
  return (
    <div className="space-y-4">
      {/* Audio Player */}
      {group.audio && (
        <audio
          controls
          className="w-full bg-slate-100 rounded-xl p-2  border border-slate-500"
        >
          <source src={group.audio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}

      {/* Image */}
      {group.image && (
        <div className="relative flex justify-center items-center h-60 rounded-xl overflow-hidden ">
          <Image
            src={group.image}
            layout="intrinsic"
            width="500"
            height="0"
            sizes="100vw"
            className="object-cover rounded-xl"
            alt="Group Image"
            loading="lazy"
          />
        </div>
      )}

      {/* Document Text */}
      {group.documentText && (
        <div
          className=" bg-slate-100 text-sm p-4 rounded-xl  border border-slate-500 text-zinc-700"
          dangerouslySetInnerHTML={{ __html: group.documentText }}
        ></div>
      )}

      {/* Transcript */}
      {group.transcript && (
        <div
          className="bg-slate-100 text-sm p-4 rounded-xl border border-slate-500 text-zinc-700"
          dangerouslySetInnerHTML={{ __html: group.transcript }}
        ></div>
      )}
    </div>
  );
};
