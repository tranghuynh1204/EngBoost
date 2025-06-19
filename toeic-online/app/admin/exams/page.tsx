"use client";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import { TbUpload } from "react-icons/tb";

// Dynamically import JoditEditor with loading state
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-slate-50 rounded-lg border border-slate-300 animate-pulse">
      <div className="p-4 text-sm text-slate-400">Loading editor...</div>
    </div>
  ),
});

// Dynamically import Cloudinary widget
const CldUploadWidget = dynamic(
  () => import("next-cloudinary").then((mod) => mod.CldUploadWidget),
  {
    ssr: false,
    loading: () => (
      <div className="w-[145px] h-[38px] bg-slate-100 rounded-lg animate-pulse" />
    ),
  }
);

// Dynamically import Spreadsheet with loading state
const Spreadsheet = dynamic(
  () => import("react-spreadsheet").then((mod) => mod.Spreadsheet),
  {
    ssr: false,
    loading: () => (
      <div className="text-xs text-slate-500 p-4 bg-slate-50 rounded border border-slate-200">
        Loading spreadsheet data...
      </div>
    ),
  }
);

const AdminExamsPage = () => {
  const [data, setData] = useState<{ value: string; readOnly: boolean }[][]>(
    []
  );
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (value: string) => {
    setContent(value);
  };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUploadSuccess = (result: any) => {
    setData((prevData) => [
      ...prevData,
      [
        { value: result?.info.original_filename, readOnly: true },
        { value: result?.info.secure_url, readOnly: true },
      ],
    ]);
  };

  if (!mounted) {
    return (
      <div className="bg-gray-100 min-h-screen p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/4 mb-2" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg space-y-4 w-full mx-auto">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl text-zinc-700 font-extrabold">Exam Page</h1>
          <p className="text-sm text-zinc-500 max-w-2xl">
            ffortlessly review exam details in the admin editor and copy exam
            data into Excel for streamlined analysis and reporting.
          </p>
        </div>

        <div className="sm:mt-0">
          <CldUploadWidget
            signatureEndpoint="/api/sign-cloudinary-params"
            onSuccess={handleUploadSuccess}
          >
            {({ open }) => (
              <Button
                onClick={() => open()}
                className="bg-white border border-slate-300 text-sm text-zinc-700 rounded-lg hover:bg-slate-100 transition-all duration-200 ease-in-out shadow-sm"
              >
                <TbUpload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            )}
          </CldUploadWidget>
        </div>
      </header>

      {/* Spreadsheet Section */}
      {data.length > 0 && (
        <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg">
          <div className="max-w-6xl mx-auto overflow-auto">
            <Spreadsheet
              data={data}
              columnLabels={["Filename", "URL"]}
              className="text-xs"
            />
          </div>
        </div>
      )}

      {/* Editor Section */}
      <div className="space-y-4">
        <h2 className="text-zinc-700 text-sm font-medium">
          HTML Content Editor
        </h2>
        <JoditEditor
          ref={editor}
          value={content}
          onChange={handleChange}
          className="w-full bg-slate-50 text-gray-800 border border-slate-300 rounded-lg"
          config={{
            readonly: false,
            toolbarButtonSize: "small",
            theme: "default",
            height: 400,
          }}
        />
      </div>

      {/* Preview Section */}
      <div className="mt-4 p-4 bg-slate-50 text-zinc-700 border border-slate-200 rounded-lg">
        <h2 className="text-gray-800 font-semibold mb-2 text-sm">
          Editor Preview
        </h2>
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default AdminExamsPage;
