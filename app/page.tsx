import ImageUpload from "@/components/image-upload";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { SiteFooter } from "@/components/site-footer";

import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { headers } from "next/headers";

export default function Home() {
  // call the function and assign the headers to a constant
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const isDesktop = Boolean(userAgent?.match(/Chrome|Edge|Edg/i));

  return (
    <main className="w-full mx-auto container px-4 sm:px-6 lg:px-8">
      <PageHeader className="my-1">
        <PageHeaderHeading className="mb-4">
          클릭 한 번으로 <br />
          사진에서 배경화면을 제거하세요!
        </PageHeaderHeading>
        <PageHeaderDescription>
          JPEG과 PNG 이미지에서 AI를 활용하여 빠르게 배경화면을 제거합니다.
          <br />그 어떤 경우에도 사진은 서버에 저장되지 않습니다.
        </PageHeaderDescription>
      </PageHeader>
      <div className="my-4">
        {isDesktop ? (
          <ImageUpload />
        ) : (
          <div className="bg-gray-50 flex justify-center items-center flex-col rounded-md h-[50vh]">
            <span className="font-normal leading-snug text-muted-foreground text-left p-8">
              Chrome, Edge 데스크탑 브라우저에서만 사용이 가능합니다. 😭😭😭
            </span>
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
