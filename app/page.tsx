import ImageUpload from "@/components/image-upload";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { SiteFooter } from "@/components/site-footer";
import { headers } from "next/headers";

export default function Home() {
  // call the function and assign the headers to a constant
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent as string);

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
      <ImageUpload isSafari={isSafari} />
      <SiteFooter />
    </main>
  );
}
