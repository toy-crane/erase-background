"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import { ChangeEvent, useState, MouseEvent, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [previewSrc, setPreviewSrc] = useState<string>("");

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewSrc("");
    }
  }, [selectedFile]);

  const fileSelectedHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const fileUploadHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      console.log(formData);
    } else {
      console.log("No file selected");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center mx-24 my-12">
      <div className="w-[450px] h-[450px] bg-gray-50 mb-12 flex p-4">
        {previewSrc && (
          <div className={"relative w-[450px]"}>
            <Image
              alt="removed image"
              src={previewSrc}
              fill
              sizes="100vw"
              style={{
                objectFit: "contain",
              }}
            />
          </div>
        )}
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Picture</Label>
        <Input id="picture" type="file" onChange={fileSelectedHandler} />
        <Button type="submit" onClick={fileUploadHandler}>
          배경 제거하기
        </Button>
      </div>
    </main>
  );
}
