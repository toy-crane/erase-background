"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, LoadingButton } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveAs } from "file-saver";
import { ChangeEvent, useState, MouseEvent, useEffect, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [removedImage, setRemovedImage] = useState<{
    blob?: Blob;
    src: string;
  }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>("");
  const [quality, setQuality] = useState<"small" | "medium">("small");
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    hiddenInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImageSrc(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setCurrentImageSrc("");
    }
  }, [selectedFile]);

  const fileSelectedHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setRemovedImage(undefined);
      setCurrentImageSrc("");
      setSelectedFile(event.target.files[0]);
    }
  };

  const fileUploadHandler = async (event: MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    event.preventDefault();
    if (selectedFile) {
      const imglyRemoveBackground = (await import("@imgly/background-removal"))
        .default;
      imglyRemoveBackground(selectedFile, {
        publicPath: "/",
        debug: true,
        model: quality,
        proxyToWorker: true,
        fetchArgs: {
          mode: "no-cors",
        },
      }).then((blob: Blob) => {
        // The result is a blob encoded as PNG. It can be converted to an URL to be used as HTMLImage.src
        const src = URL.createObjectURL(blob);
        setCurrentImageSrc(src);
        setRemovedImage({
          blob,
          src,
        });
        setLoading(false);
      });
    } else {
      console.log("No file selected");
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (removedImage?.blob) {
      const fileExtension = selectedFile?.name.split(".").pop();
      const fileName = selectedFile?.name.replace(`.${fileExtension}`, "");
      const fileNameWithExtension = `${fileName}_removed.${fileExtension}`;
      saveAs(removedImage?.blob, fileNameWithExtension);
    }
  };
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    if (!e.clipboardData || e.clipboardData.items.length === 0) {
      return;
    }
    const items = e.clipboardData.items;
    const item = items[items.length - 1];
    if (item.kind === "file" && item.getAsFile()) {
      setRemovedImage(undefined);
      setCurrentImageSrc("");
      setSelectedFile(item.getAsFile() as File);
    }
  };

  return (
    <main className="w-full mx-auto max-w-lg px-4 sm:px-6 lg:px-8 pt-8">
      <input
        type="text"
        ref={hiddenInputRef}
        onPaste={handlePaste}
        className="absolute left-[-9999px]"
      />
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 text-center">
        배경화면 깔끔하게 제거하기
      </h2>
      <div className="w-full flex py-4">
        <AspectRatio className="bg-gray-50">
          {currentImageSrc && (
            <Image
              alt="removed image"
              src={currentImageSrc}
              fill
              className="rounded-md object-contain"
            />
          )}
        </AspectRatio>
      </div>
      <div className="mb-4">
        <Tabs
          defaultValue="small"
          className="w-[400px]"
          onValueChange={(value) => setQuality(value as "small" | "medium")}
        >
          <TabsList>
            <TabsTrigger value="small">저화질</TabsTrigger>
            <TabsTrigger value="medium">고화질</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="picture">배경을 제거할 이미지를 업로드 해주세요.</Label>
        <Input
          id="picture"
          type="file"
          accept="image/jpeg,image/png"
          onChange={fileSelectedHandler}
          className="display"
        />
        {!removedImage?.src &&
          (loading ? (
            <LoadingButton />
          ) : (
            <Button type="submit" onClick={fileUploadHandler}>
              배경 제거하기
            </Button>
          ))}
        {removedImage?.src && (
          <Button onClick={handleDownload} className="w-full">
            이미지 다운로드
          </Button>
        )}
      </div>
    </main>
  );
}
