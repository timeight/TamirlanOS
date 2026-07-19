export enum ThemeId {
  LunaBlue = "luna-blue",
  LunaOlive = "luna-olive",
  LunaSilver = "luna-silver",
  Classic = "classic",
}

export interface Theme {
  id: ThemeId;
  name: string;
}
