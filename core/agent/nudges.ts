import { AchievementId } from "@/core/achievements/catalog";
import { AppKey } from "@/core/apps/app-catalog";
import type { AppId } from "@/types/application";

export interface NudgeContext {
  secondsOnSite: number;
  visitedApps: readonly string[];
  unlocked: readonly string[];
  focusedAppId: AppId | null;
  secondsOnFocused: number;
  showHidden: boolean;
  achievementCount: number;
}

export interface Nudge {
  id: string;
  messageKey: string;
  /** Shown on the accept button; opens this app. */
  action?: AppId;
  when: (ctx: NudgeContext) => boolean;
}

const seen = (ctx: NudgeContext, app: AppId) => ctx.visitedApps.includes(app);

/** Ordered by priority: the first matching nudge wins. */
export const NUDGES: readonly Nudge[] = [
  {
    id: "lost",
    messageKey: "nudge.lost",
    action: AppKey.AboutMe,
    when: (ctx) => ctx.secondsOnSite > 25 && ctx.visitedApps.length < 2,
  },
  {
    id: "explain-projects",
    messageKey: "nudge.explainProjects",
    action: AppKey.Timeline,
    when: (ctx) =>
      ctx.focusedAppId === AppKey.Projects && ctx.secondsOnFocused > 20,
  },
  {
    id: "resume",
    messageKey: "nudge.resume",
    action: AppKey.Resume,
    when: (ctx) =>
      seen(ctx, AppKey.AboutMe) &&
      seen(ctx, AppKey.Projects) &&
      !seen(ctx, AppKey.Resume),
  },
  {
    id: "shortcuts",
    messageKey: "nudge.shortcuts",
    when: (ctx) => ctx.visitedApps.length >= 3 && ctx.secondsOnSite > 70,
  },
  {
    id: "achievements",
    messageKey: "nudge.achievements",
    action: AppKey.Achievements,
    when: (ctx) =>
      ctx.achievementCount >= 4 &&
      !seen(ctx, AppKey.Achievements) &&
      ctx.secondsOnSite > 90,
  },
  {
    id: "hidden",
    messageKey: "nudge.hidden",
    action: AppKey.Portfolio,
    when: (ctx) => !ctx.showHidden && ctx.secondsOnSite > 150,
  },
  {
    id: "recycle",
    messageKey: "nudge.recycle",
    action: AppKey.RecycleBin,
    when: (ctx) => !seen(ctx, AppKey.RecycleBin) && ctx.secondsOnSite > 210,
  },
  {
    id: "games",
    messageKey: "nudge.games",
    action: AppKey.Minesweeper,
    when: (ctx) =>
      !ctx.unlocked.includes(AchievementId.Gamer) && ctx.secondsOnSite > 260,
  },
  {
    id: "contact",
    messageKey: "nudge.contact",
    action: AppKey.Contact,
    when: (ctx) => ctx.visitedApps.length >= 6 && !seen(ctx, AppKey.Contact),
  },
];

export function pickNudge(
  ctx: NudgeContext,
  alreadyShown: readonly string[],
): Nudge | null {
  return (
    NUDGES.find(
      (nudge) => !alreadyShown.includes(nudge.id) && nudge.when(ctx),
    ) ?? null
  );
}
