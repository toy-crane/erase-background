import Link from "next/link";
import Image from "next/image";

const SiteHeader = () => {
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <Link href="/">
          <Image src="/logo.svg" alt="logo" width="126" height="56" />
        </Link>
      </div>
    </header>
  );
};

export default SiteHeader;
