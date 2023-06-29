"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import imglyRemoveBackground from "@imgly/background-removal";

import { ChangeEvent, useState, MouseEvent, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true);
    event.preventDefault();
    if (selectedFile) {
      imglyRemoveBackground(selectedFile, {
        publicPath: "/",
        debug: true,
        model: "medium",
        proxyToWorker: true,
        fetchArgs: {
          mode: "no-cors",
        },
      }).then((blob: Blob) => {
        // The result is a blob encoded as PNG. It can be converted to an URL to be used as HTMLImage.src
        const url = URL.createObjectURL(blob);
        setPreviewSrc(url);
        setLoading(false);
      });
    } else {
      console.log("No file selected");
      setLoading(false);
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
        <Label htmlFor="picture">배경을 제거할 이미지를 업로드 해주세요.</Label>
        <Input id="picture" type="file" onChange={fileSelectedHandler} />
        <Button type="submit" onClick={fileUploadHandler}>
          배경 제거하기
        </Button>
        {loading && <Spinner />}
      </div>
    </main>
  );
}
