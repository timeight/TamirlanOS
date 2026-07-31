export enum AchievementId {
  FirstBoot = "first-boot",
  Explorer = "explorer",
  PowerUser = "power-user",
  WindowsVeteran = "windows-veteran",
  Reader = "reader",
  Developer = "developer",
  Recruiter = "recruiter",
  Photographer = "photographer",
  Networker = "networker",
  AiResearcher = "ai-researcher",
  Gamer = "gamer",
  Sapper = "sapper",
  Grandmaster = "grandmaster",
  Stalemate = "stalemate",
  TileMaster = "tile-master",
  Sharpshooter = "sharpshooter",
  Artist = "artist",
  Polyglot = "polyglot",
  Retro = "retro",
  Digger = "digger",
  BlueScreen = "blue-screen",
  SecretFinder = "secret-finder",
}

export interface Achievement {
  id: AchievementId;
  /** Translation keys; copy lives in the i18n dictionary. */
  titleKey: string;
  descKey: string;
  icon: string;
  secret?: boolean;
}

export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: AchievementId.FirstBoot,
    titleKey: "ach.first-boot",
    descKey: "ach.first-boot.d",
    icon: "power",
  },
  {
    id: AchievementId.Explorer,
    titleKey: "ach.explorer",
    descKey: "ach.explorer.d",
    icon: "folder",
  },
  {
    id: AchievementId.PowerUser,
    titleKey: "ach.power-user",
    descKey: "ach.power-user.d",
    icon: "folder",
  },
  {
    id: AchievementId.WindowsVeteran,
    titleKey: "ach.windows-veteran",
    descKey: "ach.windows-veteran.d",
    icon: "flag",
  },
  {
    id: AchievementId.Reader,
    titleKey: "ach.reader",
    descKey: "ach.reader.d",
    icon: "user",
  },
  {
    id: AchievementId.Developer,
    titleKey: "ach.developer",
    descKey: "ach.developer.d",
    icon: "code",
  },
  {
    id: AchievementId.Recruiter,
    titleKey: "ach.recruiter",
    descKey: "ach.recruiter.d",
    icon: "doc",
  },
  {
    id: AchievementId.Photographer,
    titleKey: "ach.photographer",
    descKey: "ach.photographer.d",
    icon: "camera",
  },
  {
    id: AchievementId.Networker,
    titleKey: "ach.networker",
    descKey: "ach.networker.d",
    icon: "mail",
  },
  {
    id: AchievementId.AiResearcher,
    titleKey: "ach.ai-researcher",
    descKey: "ach.ai-researcher.d",
    icon: "chat",
  },
  {
    id: AchievementId.Gamer,
    titleKey: "ach.gamer",
    descKey: "ach.gamer.d",
    icon: "game",
  },
  {
    id: AchievementId.Sapper,
    titleKey: "ach.sapper",
    descKey: "ach.sapper.d",
    icon: "mine",
  },
  {
    id: AchievementId.Grandmaster,
    titleKey: "ach.grandmaster",
    descKey: "ach.grandmaster.d",
    icon: "crown",
  },
  {
    id: AchievementId.Stalemate,
    titleKey: "ach.stalemate",
    descKey: "ach.stalemate.d",
    icon: "grid",
  },
  {
    id: AchievementId.TileMaster,
    titleKey: "ach.tile-master",
    descKey: "ach.tile-master.d",
    icon: "grid",
  },
  {
    id: AchievementId.Sharpshooter,
    titleKey: "ach.sharpshooter",
    descKey: "ach.sharpshooter.d",
    icon: "target",
  },
  {
    id: AchievementId.Artist,
    titleKey: "ach.artist",
    descKey: "ach.artist.d",
    icon: "brush",
  },
  {
    id: AchievementId.Polyglot,
    titleKey: "ach.polyglot",
    descKey: "ach.polyglot.d",
    icon: "globe",
  },
  {
    id: AchievementId.Retro,
    titleKey: "ach.retro",
    descKey: "ach.retro.d",
    icon: "monitor",
  },
  {
    id: AchievementId.Digger,
    titleKey: "ach.digger",
    descKey: "ach.digger.d",
    icon: "doc",
    secret: true,
  },
  {
    id: AchievementId.BlueScreen,
    titleKey: "ach.blue-screen",
    descKey: "ach.blue-screen.d",
    icon: "monitor",
    secret: true,
  },
  {
    id: AchievementId.SecretFinder,
    titleKey: "ach.secret-finder",
    descKey: "ach.secret-finder.d",
    icon: "star",
    secret: true,
  },
];

export const ACHIEVEMENT_TOTAL = ACHIEVEMENTS.length;

export function findAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((item) => item.id === id);
}
