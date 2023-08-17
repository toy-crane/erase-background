import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="py-2">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          <a
            href={siteConfig.links.survey}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            기능 개선 제안하기
          </a>
        </p>
      </div>
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <a
            href={siteConfig.links.blog}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            toy-crane
          </a>
        </p>
      </div>
    </footer>
  );
}
