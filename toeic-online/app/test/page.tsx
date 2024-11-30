"use client";
import axios from "axios";
import { useState } from "react";

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExport = async () => {
    setLoading(true);

    try {
      // Gửi yêu cầu tới API để export bài thi
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/exams/export/674987a59ecad99149a96067`,
        { responseType: "blob" } // Xác định kiểu phản hồi là file (blob)
      );

      // Tạo URL từ blob nhận được
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);

      // Tạo thẻ <a> và trigger sự kiện click tự động để tải file
      const a = document.createElement("a");
      a.href = url;
      a.download = "baithi.xlsx"; // Tên file tải về
      document.body.appendChild(a);
      a.click(); // Trigger sự kiện click để tải file

      // Sau khi tải xong, xóa thẻ <a> khỏi DOM
      document.body.removeChild(a);
    } catch {
      setError("Lỗi kết nối với server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleExport} disabled={loading}>
        {loading ? "Đang xuất bài thi..." : "Xuất bài thi"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Hiển thị lỗi nếu có */}
    </div>
  );
}
