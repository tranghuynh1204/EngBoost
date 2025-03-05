"use client";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import { TbUpload } from "react-icons/tb";
import Spreadsheet from "react-spreadsheet";

// Dynamically import client-only components
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
const CldUploadWidget = dynamic(
  () => import("next-cloudinary").then((mod) => mod.CldUploadWidget),
  { ssr: false }
);

// ClientOnly wrapper component: renders children only on the client
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    // Optionally, render a placeholder that matches your layout styling:
    return <div className="bg-gray-100" style={{ minHeight: "100vh" }} />;
  }
  return <>{children}</>;
};

const AdminExamsPage = () => {
  const [data, setData] = useState<{ value: string; readOnly: boolean }[][]>([]);
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const handleChange = (value: string) => {
    console.log(value);
    setContent(value);
  };

  return (
      <div className="bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-2 w-full mx-auto">
          {/* Header with Title, Description and Upload Button */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl text-zinc-700 mb-2 font-extrabold">
                Admin Dashboard
              </h1>
              <p className="text-sm text-zinc-500">
                Deliver real-time alerts for new user registrations, exam
                additions, and user exam participation.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
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
                  return (
                    <Button
                      onClick={() => open()}
                      className="bg-white border border-slate-300 text-sm text-zinc-700 rounded-lg hover:bg-slate-100 transition-all duration-200 ease-in-out shadow-sm"
                    >
                      <TbUpload className="w-3 h-3" />
                      Upload Image
                    </Button>
                  );
                }}
              </CldUploadWidget>
            </div>
          </header>

          {data.length > 0 && (
            <div className="border border-slate-400 bg-slate-50 p-4 rounded-lg">
              <div className="max-w-6xl text-xs mx-auto overflow-auto">
                <Spreadsheet data={data} />
              </div>
            </div>
          )}

          <div>
            <h2 className="text-zinc-700 text-sm font-medium mt-4 mb-4">
              HTML Content Editor
            </h2>
            <JoditEditor
              ref={editor}
              value={content}
              onChange={handleChange}
              className="w-full h-[70%] mt-4 bg-slate-50 text-gray-800 border border-slate-400 rounded-lg"
            />
            <style jsx global>{`
              .jodit-container {
                background-color: #f8fafc !important; /* slate-50 */
                border: 1px solid #94a3b8 !important; /* slate-400 */
                border-radius: 8px !important;
              }
              .jodit-wysiwyg {
                background-color: #f1f5f9 !important; /* slate-100 */
                color: #94a3b8 !important; /* slate-800 */
                padding: 12px !important;
                border-radius: 2px !important;
              }
              .jodit-toolbar {
                background-color: #e2e8f0 !important; /* slate-200 */
                border-bottom: 1px solid #94a3b8 !important; /* slate-400 */
              }
              .jodit-status-bar {
                background-color: #cbd5e1 !important; /* slate-300 */
                color: #94a3b8 !important; /* slate-600 */
                border-top: #94a3b8 !important; /* slate-400 */
              }
              .jodit-wysiwyg p {
                color: #94a3b8 !important;
              }
              .jodit-wysiwyg a {
                color: #94a3b8 !important; /* slate-500 */
              }
            `}</style>
          </div>

          <div className="mt-4 p-6 bg-slate-50 text-zinc-700 border border-slate-400 rounded-lg">
            <h2 className="text-gray-800 font-semibold mb-2 text-sm">
              Editor Output
            </h2>
            {content}
          </div>
        </div>
      </div>
  );
};

export default AdminExamsPage;
