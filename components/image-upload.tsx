"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, LoadingButton } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveAs } from "file-saver";
import { ChangeEvent, useState, MouseEvent, useEffect, useRef } from "react";
import Image from "next/image";

import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAmplitude } from "@/lib/amplitude";

export function AlertDestructive({ error }: { error: string }) {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}

export default function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [removedImage, setRemovedImage] = useState<{
    blob?: Blob;
    src: string;
  }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>("");
  const [quality, setQuality] = useState<"small" | "medium">("small");
  const [error, setError] = useState<string | undefined>(undefined);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { track } = useAmplitude();

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
    track("remove bg btn clicked");
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
      setError("이미지를 선택해주세요");
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    track("douwnload btn clicked");
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
    if (item.kind === "file") {
      const file = item.getAsFile();
      const isImage = file && /^image\/(jpeg|png)$/.test(file.type);
      if (isImage) {
        setRemovedImage(undefined);
        setCurrentImageSrc("");
        setSelectedFile(item.getAsFile() as File);
      } else {
        setError("이미지는 PNG 및 JPEG 만 지원됩니다.");
      }
    } else {
      setError("이미지는 PNG 및 JPEG 만 지원됩니다.");
    }
  };

  const handleUploadBtnClick = () => {
    // trigger the click event of the hidden file input
    fileInputRef.current?.click();
    track("upload btn clicked");
  };

  const handleReset = () => {
    track("reset btn clicked");
    setRemovedImage(undefined);
    setCurrentImageSrc("");
    setSelectedFile(undefined);
  };

  return (
    <>
      <div className="w-full">
        <input
          type="text"
          ref={hiddenInputRef}
          onPaste={handlePaste}
          className="absolute left-[-9999px]"
        />
        <AspectRatio className="bg-gray-50 flex justify-center items-center flex-col rounded-md">
          {currentImageSrc ? (
            <Image
              alt="removed image"
              src={currentImageSrc}
              fill
              className="rounded-md object-contain"
            />
          ) : (
            <>
              <Button size="lg" onClick={handleUploadBtnClick}>
                이미지 업로드
              </Button>
              <Label
                htmlFor="necessary"
                className="flex flex-col space-y-1 my-2"
              >
                <span className="font-normal leading-snug text-muted-foreground text-center">
                  Control + V를 사용하여 붙여 넣기도 가능합니다
                </span>
              </Label>
              <Input
                id="picture"
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png"
                onChange={fileSelectedHandler}
                className="hidden"
              />
            </>
          )}
        </AspectRatio>
      </div>
      {error ? (
        <AlertDestructive error={error} />
      ) : selectedFile ? (
        <div>
          <div className="my-2">
            <Tabs
              defaultValue="small"
              className="w-[400px]"
              onValueChange={(value) => {
                track(`${value} quality tab clicked`);
                setQuality(value as "small" | "medium");
              }}
            >
              <TabsList>
                <TabsTrigger value="small">저화질</TabsTrigger>
                <TabsTrigger value="medium">고화질</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="grid w-full items-center gap-1.5 my-4">
            {!removedImage?.src &&
              (loading ? (
                <LoadingButton />
              ) : (
                <Button type="submit" onClick={fileUploadHandler}>
                  배경 제거하기
                </Button>
              ))}
            {removedImage?.src && (
              <>
                <Button onClick={handleDownload} className="w-full">
                  이미지 다운로드
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full"
                >
                  다른 이미지 업로드하기
                </Button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
