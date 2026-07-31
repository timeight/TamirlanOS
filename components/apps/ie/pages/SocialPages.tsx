"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";
import { siteConfig } from "@/core/config/site";
import { useT } from "@/hooks/use-translations";

interface ExternalProps {
  onExternal: (url: string, label: string) => void;
}

const REPOS = [
  { name: "TamirlanOS", lang: "TypeScript", color: "#3178c6", stars: 128 },
  { name: "cut-ai", lang: "Python", color: "#3572A5", stars: 64 },
  { name: "iron-form", lang: "Swift", color: "#F05138", stars: 41 },
  { name: "blender-tools", lang: "Python", color: "#3572A5", stars: 27 },
] as const;

export function GithubPage({ onExternal }: ExternalProps) {
  const t = useT();
  return (
    <div className="bg-white p-4 font-sans text-[12px] text-[#24292f]">
      <div className="flex flex-wrap gap-4 border-b border-[#d0d7de] pb-4">
        <Image
          src={siteConfig.avatarSrc}
          alt=""
          width={92}
          height={92}
          unoptimized
          className="rounded-full border border-[#d0d7de]"
        />
        <div className="min-w-0">
          <p className="text-[18px] font-bold">Tamirlan Zhamalov</p>
          <p className="text-[#57606a]">timeight</p>
          <p className="mt-1 max-w-[420px] leading-4">{t("ie.gh.bio")}</p>
          <p className="mt-2 text-[11px] text-[#57606a]">
            <b className="text-[#24292f]">128</b> followers ·{" "}
            <b className="text-[#24292f]">64</b> following ·{" "}
            <b className="text-[#24292f]">Kazakhstan</b>
          </p>
          <button
            type="button"
            onClick={() =>
              onExternal("https://github.com/timeight", "github.com")
            }
            className="mt-2 rounded-[4px] border border-[#1f883d] bg-[#1f883d] px-3 py-1 text-[11px] font-bold text-white hover:brightness-110"
          >
            {t("ie.openReal")}
          </button>
        </div>
      </div>

      <p className="mt-4 mb-2 font-bold">{t("ie.gh.pinned")}</p>
      <div className="grid gap-2 @sm:grid-cols-2">
        {REPOS.map((repo) => (
          <div
            key={repo.name}
            className="rounded-[6px] border border-[#d0d7de] p-2.5"
          >
            <p className="font-bold text-[#0969da]">{repo.name}</p>
            <p className="mt-1 flex items-center gap-3 text-[11px] text-[#57606a]">
              <span className="flex items-center gap-1">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: repo.color }}
                />
                {repo.lang}
              </span>
              <span>★ {repo.stars}</span>
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 mb-1.5 font-bold">{t("ie.gh.contrib")}</p>
      <div className="flex flex-wrap gap-[3px] rounded-[6px] border border-[#d0d7de] p-2">
        {Array.from({ length: 182 }).map((_, index) => {
          const level = (index * 7) % 5;
          const shades = [
            "#ebedf0",
            "#9be9a8",
            "#40c463",
            "#30a14e",
            "#216e39",
          ];
          return (
            <span
              key={index}
              className="h-[9px] w-[9px] rounded-[2px]"
              style={{ background: shades[level] }}
            />
          );
        })}
      </div>
    </div>
  );
}

const POSTS = [
  "#f2b179",
  "#7fb2e5",
  "#7cc48a",
  "#b98ae0",
  "#e8c15a",
  "#e0574a",
  "#5fd4ff",
  "#c6f24e",
  "#8a6d3b",
] as const;

export function InstagramPage({ onExternal }: ExternalProps) {
  const t = useT();
  return (
    <div className="bg-white p-4 text-[12px] text-black">
      <div className="flex flex-wrap items-center gap-5 border-b border-[#dbdbdb] pb-4">
        <span className="rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[3px]">
          <Image
            src={siteConfig.avatarSrc}
            alt=""
            width={84}
            height={84}
            unoptimized
            className="block rounded-full border-2 border-white"
          />
        </span>
        <div>
          <p className="text-[16px]">zhamallov</p>
          <p className="mt-1.5 flex gap-4 text-[11px]">
            <span>
              <b>248</b> {t("ie.ig.posts")}
            </span>
            <span>
              <b>3 120</b> {t("ie.ig.followers")}
            </span>
            <span>
              <b>412</b> {t("ie.ig.following")}
            </span>
          </p>
          <p className="mt-1.5 text-[11px] leading-4">{t("ie.ig.bio")}</p>
          <button
            type="button"
            onClick={() =>
              onExternal("https://instagram.com/zhamallov", "instagram.com")
            }
            className="mt-2 rounded-[6px] border border-[#dbdbdb] bg-[#efefef] px-3 py-1 text-[11px] font-bold hover:bg-[#e0e0e0]"
          >
            {t("ie.openReal")}
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-[#dbdbdb] py-3">
        {["street", "3d", "podcast", "travel"].map((story) => (
          <div key={story} className="text-center">
            <span className="block h-14 w-14 rounded-full bg-gradient-to-tr from-[#f9ce34] to-[#6228d7] p-[2px]">
              <span className="block h-full w-full rounded-full border-2 border-white bg-[#eee]" />
            </span>
            <span className="mt-1 block text-[10px]">{story}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1">
        {POSTS.map((color, index) => (
          <span
            key={index}
            className="block aspect-square"
            style={{ background: color }}
          />
        ))}
      </div>
    </div>
  );
}

export function LinkedInPage({ onExternal }: ExternalProps) {
  const t = useT();
  return (
    <div className="bg-[#f4f2ee] p-3 text-[12px] text-[#000000e6]">
      <div className="rounded-[8px] border border-[#e0dfdc] bg-white">
        <div className="h-16 rounded-t-[8px] bg-gradient-to-r from-[#0a66c2] to-[#004182]" />
        <div className="px-4 pt-0 pb-4">
          <Image
            src={siteConfig.avatarSrc}
            alt=""
            width={88}
            height={88}
            unoptimized
            className="-mt-10 rounded-full border-4 border-white"
          />
          <p className="mt-2 text-[18px] font-bold">Tamirlan Zhamalov</p>
          <p className="text-[13px]">{t("ie.li.headline")}</p>
          <p className="mt-0.5 text-[11px] text-[#00000099]">
            Kazakhstan · 500+ {t("ie.li.connections")}
          </p>
          <button
            type="button"
            onClick={() => onExternal("https://linkedin.com", "linkedin.com")}
            className="mt-2 rounded-full bg-[#0a66c2] px-4 py-1 text-[11px] font-bold text-white hover:bg-[#004182]"
          >
            {t("ie.openReal")}
          </button>
        </div>
      </div>

      <Card title={t("ie.li.experience")}>
        <Row title={t("ie.li.job1")} sub="Tamirlan Studio · 2021 — н. в." />
        <Row
          title={t("ie.li.job2")}
          sub={`${t("ie.li.college")} · 2023 — н. в.`}
        />
        <Row title={t("ie.li.job3")} sub="WorldSkills Kazakhstan · 2023" />
      </Card>

      <Card title={t("ie.li.education")}>
        <Row title={t("ie.li.edu1")} sub="2020 — 2024" />
      </Card>

      <Card title={t("ie.li.skills")}>
        <p className="text-[11px] leading-5">
          TypeScript · React · Next.js · Python · C# · Prompt Engineering ·
          Computer Vision · Blender · Maya · Figma · DaVinci Resolve
        </p>
      </Card>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-2 rounded-[8px] border border-[#e0dfdc] bg-white p-4">
      <p className="mb-2 text-[14px] font-bold">{title}</p>
      {children}
    </div>
  );
}

function Row({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-2 border-l-2 border-[#0a66c2] pl-2.5 last:mb-0">
      <p className="font-bold">{title}</p>
      <p className="text-[11px] text-[#00000099]">{sub}</p>
    </div>
  );
}
