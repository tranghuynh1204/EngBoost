"use client";
import {
  CldImage,
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { useEffect, useState } from "react";

import Spreadsheet from "react-spreadsheet";

const AdminExamsPage = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [data, setData] = useState<{ value: string; readOnly: boolean }[][]>(
    []
  );

  return (
    <div>
      <CldUploadWidget
        signatureEndpoint="/api/sign-cloudinary-params"
        onSuccess={(result: any, { widget }) => {
          console.log(result?.info);
          setResources((prevResources) => [
            ...prevResources,
            result?.info.secure_url,
          ]);
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
        <Spreadsheet data={data} />;
      </div>
    </div>
  );
};

export default AdminExamsPage;
