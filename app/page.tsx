import ImageUpload from "@/components/image-upload";
import { headers } from "next/headers";

export default function Home() {
  // call the function and assign the headers to a constant
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent as string);

  return (
    <main className="w-full mx-auto max-w-lg px-4 sm:px-6 lg:px-8 pt-8">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 text-center">
        배경화면 깔끔하게 제거하기
      </h2>
      <ImageUpload isSafari={isSafari} />
    </main>
  );
}
