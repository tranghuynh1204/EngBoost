"use client";
import {
  CldImage,
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { useEffect, useState } from "react";

const AdminExamsPage = () => {
  const [resources, setResources] = useState<any[]>([]);
  useEffect(() => console.log(resources), [resources]);
  return (
    <div>
      <CldUploadWidget
        signatureEndpoint="/api/sign-cloudinary-params"
        onSuccess={(result: any, { widget }) => {
          setResources((prevResources) => [...prevResources, result?.info]);
        }}
      >
        {({ open }) => {
          function handleOnClick() {
            open();
          }
          return <button onClick={handleOnClick}>Upload an Image</button>;
        }}
      </CldUploadWidget>
      <div className="flex space-x-10 mt-5">
        {/* Bảng 1: Hiển thị ảnh */}
        <div className="flex-1">
          <h4>Ảnh</h4>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Image</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">
                    <CldImage
                      width="960"
                      height="600"
                      src={item.public_id}
                      sizes="100vw"
                      alt={`Image ${index + 1}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bảng 2: Hiển thị các liên kết */}
        <div className="flex-1">
          <h4>Liên kết</h4>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Tên file</th>
                <th className="px-4 py-2">link</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">
                    <div>{item.secure_url}</div>
                  </td>
                  <td className="px-4 py-2">
                    <div>{item.secure_url}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminExamsPage;
