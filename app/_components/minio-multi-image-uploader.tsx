"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SPRING_API_BASE = "http://localhost:8080/image";

export default function MinioMultiImageUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const uploadAll = async () => {
    if (files.length === 0) return;

    setUploading(true);

    try {
      // 1. presigned URL 요청 (다중)
      const filenames = files.map(
        (file) => `uploads/${Date.now()}-${file.name}`,
      );
      const contentTypes = files.map((file) => file.type);

      const form = new URLSearchParams();
      filenames.forEach((name) => form.append("filenames", name));
      contentTypes.forEach((type) => form.append("contentTypes", type));

      const res = await fetch(`${SPRING_API_BASE}/upload-urls`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
        credentials: "include",
      });

      if (!res.ok) throw new Error("presigned URL 요청 실패");

      const presignedUrls: { imageId: string; presignedUrl: string }[] =
        await res.json();

      // 2. S3에 실제 파일 업로드
      const uploadPromises = presignedUrls.map(async (item, idx) => {
        const file = files[idx];
        const uploadRes = await fetch(item.presignedUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadRes.ok) throw new Error(`파일 업로드 실패: ${file.name}`);
        return item.imageId;
      });

      const uploadedImageIds = await Promise.all(uploadPromises);
      console.log(uploadedImageIds);
      // 3. 업로드 완료 알림 전송
      const confirmRes = await fetch(`${SPRING_API_BASE}/confirm-uploads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploadedImageIds),
        credentials: "include",
      });

      if (!confirmRes.ok) throw new Error("업로드 완료 알림 실패");

      alert("모든 이미지 업로드 및 완료 알림 전송 성공!");
    } catch (err) {
      console.error(err);
      alert("업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="cursor-pointer"
      />
      <Button onClick={uploadAll} disabled={uploading || files.length === 0}>
        {uploading ? "업로드 중..." : "MinIO에 다중 업로드"}
      </Button>
    </div>
  );
}
