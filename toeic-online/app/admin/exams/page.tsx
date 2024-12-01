"use client";
import { CldUploadWidget } from "next-cloudinary";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
import Spreadsheet from "react-spreadsheet";

const AdminExamsPage = () => {
  const [data, setData] = useState<{ value: string; readOnly: boolean }[][]>(
    []
  );
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const handleChange = (value: string) => {
    console.log(value);
    setContent(value);
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg space-y-8 max-w-5xl mx-auto">
        <h1 className="text-black text-2xl font-semibold text-center">
          Admin Exams Page
        </h1>

        <CldUploadWidget
          signatureEndpoint="/api/sign-cloudinary-params"
          onSuccess={(result: any) => {
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
            return (
              <button
                onClick={handleOnClick}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 ease-in-out shadow-md"
              >
                Upload an Image
              </button>
            );
          }}
        </CldUploadWidget>

        {data.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
            <h2 className="text-gray-800 font-medium mb-4">Spreadsheet</h2>
            <div className="max-w-4xl mx-auto overflow-auto">
              <Spreadsheet data={data} />
            </div>
          </div>
        )}

        <div>
          <h2 className="text-gray-800 font-medium mb-4">
            HTML Content Editor
          </h2>
          <JoditEditor
            ref={editor}
            value={content}
            onChange={handleChange}
            className="w-full h-[70%] mt-4 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg"
          />
          <style>{`.jodit-wysiwyg{height:300px !important; background-color: #f9fafb !important; color: #1f2937 !important; border-radius: 8px !important;}`}</style>
        </div>

        <div className="mt-4 p-6 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg shadow-md">
          <h2 className="text-gray-800 font-semibold mb-2">Editor Output</h2>
          {content}
        </div>
      </div>
    </div>
  );
};

export default AdminExamsPage;
