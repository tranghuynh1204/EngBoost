import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { openModal } from "@/lib/store/modal-slice";
import { useDispatch } from "react-redux";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { TbMessage2Plus } from "react-icons/tb";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
export const HightLightControl = () => {
  const dispatch = useDispatch();
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });
  const [hidden, setHidden] = useState(true);
  const selectedText = useRef<string>();
  const controlRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        selectedText.current = selection.toString();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect && rect.top !== 0 && rect.left !== 0) {
          setPosition({
            top: rect.top + window.scrollY - 40,
            left: rect.left + window.scrollX,
          });
          setHidden(false);
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        controlRef.current &&
        !controlRef.current.contains(e.target as Node)
      ) {
        setHidden(true);
      }
    };

    // Lắng nghe sự kiện chuột nhả ra
    document.addEventListener("mouseup", handleSelection);

    // Lắng nghe sự kiện nhấn chuột ra ngoài
    document.addEventListener("mousedown", handleClickOutside);

    // Dọn dẹp sự kiện khi component bị hủy
    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onClick = () => {
    dispatch(
      openModal({
        type: "CreateVocabulary",
        data: { vocabulary: { word: selectedText.current } },
      })
    );
  };
  return (
    <div
      ref={controlRef}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      className={`absolute bg-cyan-50 border rounded-lg border-cyan-400
       ${hidden ? "hidden" : ""}`}
    >
      <TooltipProvider>
        <Tooltip >
          <TooltipTrigger asChild > 
            <Button
              onClick={onClick}
              className="p-1 h-8 w-8 flex items-center justify-center"
            >
              <TbMessage2Plus size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-black text-white" side="right" >
            <p>Add to Flashcards</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
