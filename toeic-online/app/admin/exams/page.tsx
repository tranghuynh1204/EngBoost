"use client";
import {
  CldImage,
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
import Spreadsheet from "react-spreadsheet";

const AdminExamsPage = () => {
  const [data, setData] = useState<{ value: string; readOnly: boolean }[][]>(
    []
  );
  const editor = useRef(null);
  const [content, setContent] = useState("Worlds best html page");

  const handleChange = (value: string) => {
    console.log(value);
    setContent(value);
  };

  return (
    <div>
      <CldUploadWidget
        signatureEndpoint="/api/sign-cloudinary-params"
        onSuccess={(result: any, { widget }) => {
          setData((prevData) => [
            ...prevData,
            [
              { value: result?.info.original_filename, readOnly: true },
              { value: result?.info.secure_url, readOnly: true },
            ],
          ]);
        }}
      >
        {({ open }) => {
          function handleOnClick() {
            open();
          }
          return <button onClick={handleOnClick}>Upload an Image</button>;
        }}
      </CldUploadWidget>
      <div>
        <Spreadsheet data={data} />
      </div>
      <div>
        <div>Có thể dán chữ đã định dạng, mã html đều được</div>
        <JoditEditor
          ref={editor}
          value={content}
          onChange={handleChange}
          className="w-full h-[70%] mt-10 bg-white"
        />
        <style>{`.jodit-wysiwyg{height:300px !important}`}</style>
      </div>
      <div>{content}</div>
    </div>
  );
};

export default AdminExamsPage;
