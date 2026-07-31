import { PetState as P } from "@/core/pet/pet-types";
import { story, type Story } from "@/core/pet/story/story-types";

/**
 * Each story is a tiny scene with a beginning, a turn and an ending. They are
 * data only — the player just holds each beat for its duration.
 */

const REPAIR: readonly Story[] = [
  story("rep-cable", ["repair"], 10, [
    [P.Walk, 3],
    [P.Confused, 1.6],
    [P.Repair, 4],
    [P.Idle, 1.4],
    [P.Walk, 2.5],
  ]),
  story("rep-screwdriver", ["repair", "mishap"], 9, [
    [P.Repair, 3],
    [P.Confused, 2],
    [P.LookAround, 2.4],
    [P.Repair, 3],
  ]),
  story("rep-proud", ["repair"], 8, [
    [P.Repair, 4.5],
    [P.Idle, 1.2],
    [P.Celebrate, 2.4],
  ]),
  story("rep-failed", ["repair", "mishap"], 7, [
    [P.Repair, 3.5],
    [P.Confused, 2.4],
    [P.Repair, 2.6],
    [P.Confused, 2],
    [P.Walk, 2.5],
  ]),
  story("rep-inspect-first", ["repair"], 8, [
    [P.Inspect, 2.6],
    [P.Think, 2],
    [P.Repair, 3.6],
    [P.Idle, 1.4],
  ]),
  story("rep-tighten", ["repair"], 7, [
    [P.Walk, 2.8],
    [P.Sit, 2],
    [P.Repair, 3.4],
    [P.Wave, 1.6],
  ]),
  story("rep-listen", ["repair", "curiosity"], 6, [
    [P.Observe, 2.4],
    [P.Think, 2.2],
    [P.Repair, 3.2],
    [P.Idle, 1.6],
  ]),
  story("rep-dust", ["repair"], 6, [
    [P.Sit, 2.4],
    [P.Repair, 3],
    [P.Confused, 1.6],
    [P.Repair, 2.4],
  ]),
  story("rep-check-twice", ["repair"], 6, [
    [P.Repair, 3],
    [P.Inspect, 2.2],
    [P.Repair, 2.4],
    [P.Celebrate, 2.2],
  ]),
  story("rep-give-up", ["repair", "mishap"], 5, [
    [P.Repair, 4],
    [P.Confused, 2.6],
    [P.Sit, 3],
  ]),
  story("rep-taskbar", ["repair"], 6, [
    [P.Walk, 3.2],
    [P.Repair, 4.2],
    [P.Wave, 1.6],
    [P.Walk, 2.4],
  ]),
  story("rep-antenna", ["repair", "mishap"], 6, [
    [P.Confused, 2],
    [P.Repair, 2.8],
    [P.Jump, 1.2],
    [P.Idle, 1.6],
  ]),
];

const CURIOSITY: readonly Story[] = [
  story("cur-folder", ["curiosity"], 10, [
    [P.Walk, 3],
    [P.Inspect, 3],
    [P.Idle, 1.2],
    [P.Walk, 2.4],
  ]),
  story("cur-peek-window", ["curiosity"], 10, [
    [P.Walk, 2.8],
    [P.Peek, 2.2],
    [P.Observe, 2.8],
    [P.Walk, 2.4],
  ]),
  story("cur-double-take", ["curiosity"], 9, [
    [P.Walk, 2.6],
    [P.Idle, 0.8],
    [P.LookAround, 2],
    [P.Inspect, 2.6],
    [P.Think, 2],
  ]),
  story("cur-icon-study", ["curiosity"], 9, [
    [P.Inspect, 3.2],
    [P.Think, 2.4],
    [P.Idle, 1.4],
    [P.Walk, 2.6],
  ]),
  story("cur-follow-nothing", ["curiosity"], 8, [
    [P.Observe, 2.4],
    [P.Walk, 3],
    [P.LookAround, 2.4],
    [P.Confused, 1.8],
  ]),
  story("cur-corner", ["curiosity"], 7, [
    [P.Walk, 3.4],
    [P.Peek, 2.4],
    [P.Idle, 1.6],
    [P.Walk, 2.6],
  ]),
  story("cur-listen-close", ["curiosity"], 7, [
    [P.Observe, 3],
    [P.Think, 2.6],
    [P.Observe, 2.2],
  ]),
  story("cur-read-screen", ["curiosity", "observe"], 8, [
    [P.Walk, 2.6],
    [P.Observe, 4],
    [P.Think, 2.2],
    [P.Walk, 2.2],
  ]),
  story("cur-shadow", ["curiosity"], 6, [
    [P.Idle, 1.6],
    [P.Inspect, 2.6],
    [P.Jump, 1.2],
    [P.Confused, 1.8],
  ]),
  story("cur-tap-glass", ["curiosity"], 6, [
    [P.Inspect, 2.4],
    [P.Repair, 2],
    [P.Observe, 2.4],
    [P.Idle, 1.4],
  ]),
  story("cur-follow-cable", ["curiosity"], 7, [
    [P.Walk, 3],
    [P.Inspect, 2.4],
    [P.Walk, 2.6],
    [P.Confused, 1.8],
  ]),
  story("cur-open-close", ["curiosity"], 8, [
    [P.Inspect, 2.4],
    [P.Idle, 1],
    [P.Inspect, 2],
    [P.Wave, 1.6],
  ]),
  story("cur-what-was-that", ["curiosity"], 7, [
    [P.LookAround, 2.6],
    [P.Walk, 2.6],
    [P.LookAround, 2.2],
    [P.Idle, 1.6],
  ]),
];

const SOCIAL: readonly Story[] = [
  story("soc-wave-ignored", ["social"], 10, [
    [P.Wave, 1.8],
    [P.Idle, 1.8],
    [P.Confused, 2],
    [P.Walk, 2.6],
  ]),
  story("soc-wave-happy", ["social"], 9, [
    [P.Observe, 2],
    [P.Wave, 1.8],
    [P.Jump, 1.2],
    [P.Idle, 1.4],
  ]),
  story("soc-approach", ["social"], 9, [
    [P.Walk, 3],
    [P.Observe, 2.4],
    [P.Wave, 1.8],
    [P.Sit, 2.4],
  ]),
  story("soc-shy", ["social"], 8, [
    [P.Peek, 2.2],
    [P.Idle, 1.4],
    [P.Peek, 1.8],
    [P.Walk, 2.4],
  ]),
  story("soc-show-off", ["social", "play"], 7, [
    [P.Wave, 1.6],
    [P.Dance, 3],
    [P.Idle, 1.4],
    [P.Wave, 1.6],
  ]),
  story("soc-follow-cursor", ["social"], 8, [
    [P.Observe, 2.6],
    [P.Walk, 3],
    [P.Observe, 2.4],
    [P.Wave, 1.6],
  ]),
  story("soc-wait", ["social"], 7, [
    [P.Sit, 3.4],
    [P.LookAround, 2.4],
    [P.Sit, 2.6],
  ]),
  story("soc-goodbye", ["social"], 6, [
    [P.Wave, 1.8],
    [P.Walk, 3.4],
    [P.Idle, 1.4],
    [P.Wave, 1.6],
  ]),
  story("soc-invite", ["social"], 6, [
    [P.Wave, 1.6],
    [P.Walk, 2.6],
    [P.Idle, 1.2],
    [P.Wave, 1.6],
    [P.Walk, 2.2],
  ]),
  story("soc-double-wave", ["social"], 6, [
    [P.Wave, 1.6],
    [P.Idle, 1],
    [P.Wave, 1.6],
    [P.Jump, 1.2],
  ]),
  story("soc-checking-in", ["social"], 7, [
    [P.Walk, 2.8],
    [P.Peek, 2],
    [P.Wave, 1.6],
    [P.Walk, 2.4],
  ]),
  story("soc-thumbs", ["social"], 6, [
    [P.Observe, 2.2],
    [P.Celebrate, 2.4],
    [P.Idle, 1.6],
  ]),
];

const REST: readonly Story[] = [
  story("rest-stars", ["rest", "night"], 10, [
    [P.Walk, 2.6],
    [P.Sit, 3.4],
    [P.Observe, 3.4],
    [P.Sleep, 4],
  ]),
  story("rest-sit-think", ["rest"], 9, [
    [P.Sit, 3.4],
    [P.Think, 3],
    [P.Sit, 2.6],
  ]),
  story("rest-stretch", ["rest"], 9, [
    [P.Idle, 2],
    [P.Wake, 1.8],
    [P.Idle, 2],
    [P.Walk, 2.4],
  ]),
  story("rest-slow-walk", ["rest"], 8, [
    [P.Walk, 4],
    [P.Idle, 2],
    [P.Sit, 3],
  ]),
  story("rest-nap-attempt", ["rest"], 7, [
    [P.Sit, 2.6],
    [P.Sleep, 3],
    [P.Wake, 1.8],
    [P.LookAround, 2],
  ]),
  story("rest-quiet-corner", ["rest"], 7, [
    [P.Walk, 3.2],
    [P.Sit, 4],
    [P.Idle, 2.2],
  ]),
  story("rest-yawn-walk", ["rest"], 7, [
    [P.Idle, 2.4],
    [P.Walk, 3],
    [P.Sit, 3],
  ]),
  story("rest-watch-clock", ["rest", "observe"], 8, [
    [P.Walk, 3],
    [P.Observe, 3.6],
    [P.Sit, 2.6],
  ]),
  story("rest-lean", ["rest"], 6, [
    [P.Sit, 3],
    [P.Idle, 2.2],
    [P.Think, 2.4],
  ]),
  story("rest-deep-breath", ["rest"], 6, [
    [P.Idle, 2.6],
    [P.Observe, 2.4],
    [P.Idle, 2.4],
  ]),
  story("rest-settle", ["rest"], 6, [
    [P.Walk, 2.6],
    [P.LookAround, 2],
    [P.Sit, 3.6],
  ]),
];

const PLAY: readonly Story[] = [
  story("play-hop-line", ["play"], 10, [
    [P.Jump, 1.2],
    [P.Walk, 2],
    [P.Jump, 1.2],
    [P.Idle, 1.4],
  ]),
  story("play-dance-solo", ["play"], 9, [
    [P.LookAround, 2],
    [P.Dance, 4],
    [P.Idle, 1.6],
    [P.Wave, 1.6],
  ]),
  story("play-spin", ["play"], 8, [
    [P.Dance, 2.6],
    [P.Dizzy, 2.2],
    [P.Idle, 1.8],
  ]),
  story("play-race", ["play"], 8, [
    [P.Run, 3],
    [P.Idle, 1.4],
    [P.Run, 2.4],
    [P.Sit, 2.4],
  ]),
  story("play-jump-over", ["play"], 8, [
    [P.Walk, 2.4],
    [P.Idle, 0.8],
    [P.Jump, 1.2],
    [P.Walk, 2.4],
  ]),
  story("play-shadow-box", ["play"], 7, [
    [P.Jump, 1.2],
    [P.Dance, 2.4],
    [P.Jump, 1.2],
    [P.Idle, 1.6],
  ]),
  story("play-freestyle", ["play"], 7, [
    [P.Dance, 3.4],
    [P.Jump, 1.2],
    [P.Dance, 2.6],
    [P.Celebrate, 2],
  ]),
  story("play-hide-seek", ["play"], 7, [
    [P.Walk, 2.6],
    [P.Peek, 2],
    [P.Run, 2.4],
    [P.Peek, 2],
  ]),
  story("play-tag", ["play"], 6, [
    [P.Run, 2.6],
    [P.LookAround, 2],
    [P.Run, 2.4],
    [P.Idle, 1.6],
  ]),
  story("play-victory-lap", ["play"], 6, [
    [P.Celebrate, 2.2],
    [P.Run, 2.6],
    [P.Wave, 1.6],
  ]),
  story("play-bounce-taskbar", ["play"], 6, [
    [P.Walk, 3],
    [P.Jump, 1.2],
    [P.Jump, 1.2],
    [P.Sit, 2.4],
  ]),
  story("play-moonwalk", ["play"], 6, [
    [P.Dance, 2.6],
    [P.Walk, 2.4],
    [P.Dance, 2.4],
    [P.Wave, 1.6],
  ]),
];

const MISHAP: readonly Story[] = [
  story("mis-trip", ["mishap"], 9, [
    [P.Walk, 2.6],
    [P.Dizzy, 2],
    [P.Idle, 1.6],
    [P.Walk, 2.4],
  ]),
  story("mis-bump", ["mishap"], 9, [
    [P.Walk, 2.8],
    [P.Confused, 2],
    [P.LookAround, 2],
    [P.Walk, 2.4],
  ]),
  story("mis-sneeze", ["mishap"], 8, [
    [P.Idle, 1.6],
    [P.Confused, 1.6],
    [P.Jump, 1.2],
    [P.Idle, 1.8],
  ]),
  story("mis-wrong-way", ["mishap"], 8, [
    [P.Walk, 3],
    [P.Idle, 1.2],
    [P.Confused, 2],
    [P.Walk, 2.6],
  ]),
  story("mis-dropped", ["mishap", "repair"], 7, [
    [P.Repair, 2.4],
    [P.Confused, 1.8],
    [P.Inspect, 2.4],
    [P.Repair, 2.4],
  ]),
  story("mis-slip", ["mishap"], 7, [
    [P.Run, 2.4],
    [P.Dizzy, 2.2],
    [P.Sit, 2.4],
  ]),
  story("mis-lost", ["mishap"], 7, [
    [P.LookAround, 2.6],
    [P.Confused, 2.2],
    [P.Walk, 3],
    [P.Idle, 1.6],
  ]),
  story("mis-startled", ["mishap"], 7, [
    [P.Idle, 1.6],
    [P.Jump, 1.2],
    [P.Confused, 2],
    [P.LookAround, 2],
  ]),
  story("mis-forgot", ["mishap"], 6, [
    [P.Walk, 2.6],
    [P.Idle, 1.4],
    [P.Think, 2.4],
    [P.Confused, 1.8],
    [P.Walk, 2.2],
  ]),
  story("mis-stuck", ["mishap"], 6, [
    [P.Walk, 2.4],
    [P.Confused, 2.4],
    [P.Jump, 1.2],
    [P.Walk, 2.4],
  ]),
  story("mis-recount", ["mishap"], 6, [
    [P.Inspect, 2.4],
    [P.Confused, 1.8],
    [P.Inspect, 2.2],
    [P.Idle, 1.6],
  ]),
];

const OBSERVE: readonly Story[] = [
  story("obs-wallpaper", ["observe"], 10, [
    [P.Walk, 2.6],
    [P.Observe, 4.4],
    [P.Idle, 1.8],
  ]),
  story("obs-window-work", ["observe"], 10, [
    [P.Walk, 3],
    [P.Observe, 4],
    [P.Think, 2.2],
    [P.Walk, 2.4],
  ]),
  story("obs-tray", ["observe"], 8, [
    [P.Walk, 3.2],
    [P.Inspect, 2.6],
    [P.Observe, 2.6],
  ]),
  story("obs-taskbar-sit", ["observe"], 9, [
    [P.Walk, 3],
    [P.Sit, 3.6],
    [P.Observe, 3],
  ]),
  story("obs-start-button", ["observe"], 8, [
    [P.Walk, 3],
    [P.Peek, 2.2],
    [P.Inspect, 2.4],
    [P.Walk, 2.4],
  ]),
  story("obs-empty-desktop", ["observe"], 7, [
    [P.LookAround, 2.6],
    [P.Idle, 2],
    [P.Observe, 2.8],
  ]),
  story("obs-count-icons", ["observe"], 7, [
    [P.Inspect, 2.4],
    [P.Think, 2.2],
    [P.Inspect, 2.2],
    [P.Idle, 1.6],
  ]),
  story("obs-cursor-trail", ["observe"], 7, [
    [P.Observe, 3.2],
    [P.Walk, 2.4],
    [P.Observe, 2.6],
  ]),
  story("obs-window-move", ["observe"], 6, [
    [P.Observe, 2.6],
    [P.Confused, 1.8],
    [P.Walk, 2.6],
    [P.Observe, 2.2],
  ]),
  story("obs-reflect", ["observe"], 6, [
    [P.Sit, 3],
    [P.Observe, 3],
    [P.Think, 2.4],
  ]),
];

const NIGHT: readonly Story[] = [
  story(
    "nig-quiet",
    ["night", "rest"],
    10,
    [
      [P.Walk, 3],
      [P.Sit, 4],
      [P.Sleep, 5],
    ],
    { dayParts: ["night"] },
  ),
  story(
    "nig-cant-sleep",
    ["night"],
    8,
    [
      [P.Sleep, 3],
      [P.Wake, 1.8],
      [P.LookAround, 2.4],
      [P.Sit, 3],
    ],
    { dayParts: ["night", "evening"] },
  ),
  story(
    "nig-lights",
    ["night", "observe"],
    8,
    [
      [P.Observe, 3.4],
      [P.Think, 2.4],
      [P.Sit, 3],
    ],
    { dayParts: ["night"] },
  ),
  story(
    "nig-last-check",
    ["night", "repair"],
    7,
    [
      [P.Walk, 3],
      [P.Repair, 3],
      [P.Idle, 1.6],
      [P.Sleep, 3.4],
    ],
    { dayParts: ["night", "evening"] },
  ),
  story(
    "nig-yawn-loop",
    ["night", "rest"],
    8,
    [
      [P.Idle, 2.6],
      [P.Sit, 3],
      [P.Idle, 2.4],
    ],
    { dayParts: ["night", "evening"] },
  ),
  story(
    "mor-energetic",
    ["play"],
    9,
    [
      [P.Wake, 1.8],
      [P.Jump, 1.2],
      [P.Run, 2.6],
      [P.Wave, 1.6],
    ],
    { dayParts: ["morning"] },
  ),
  story(
    "mor-stretch-walk",
    ["rest"],
    8,
    [
      [P.Wake, 1.8],
      [P.Idle, 2],
      [P.Walk, 3.2],
    ],
    { dayParts: ["morning"] },
  ),
  story(
    "mor-tour",
    ["curiosity"],
    8,
    [
      [P.Walk, 3],
      [P.Observe, 2.6],
      [P.Walk, 2.6],
      [P.Inspect, 2.2],
    ],
    { dayParts: ["morning", "day"] },
  ),
];

const BOND: readonly Story[] = [
  story(
    "bon-show-secret",
    ["bond"],
    9,
    [
      [P.Walk, 2.6],
      [P.Peek, 2],
      [P.Wave, 1.6],
      [P.Think, 2.4],
      [P.Celebrate, 2],
    ],
    { minFriendship: 60 },
  ),
  story(
    "bon-stay-close",
    ["bond", "social"],
    9,
    [
      [P.Walk, 2.6],
      [P.Sit, 3.4],
      [P.Observe, 2.6],
      [P.Wave, 1.6],
    ],
    { minFriendship: 40 },
  ),
  story(
    "bon-dance-together",
    ["bond", "play"],
    8,
    [
      [P.Wave, 1.6],
      [P.Dance, 4],
      [P.Celebrate, 2.2],
    ],
    { minFriendship: 55 },
  ),
  story(
    "bon-guard",
    ["bond"],
    8,
    [
      [P.Walk, 3],
      [P.Sit, 4],
      [P.LookAround, 2.4],
      [P.Sit, 2.6],
    ],
    { minFriendship: 45 },
  ),
  story(
    "bon-proud-display",
    ["bond"],
    7,
    [
      [P.Celebrate, 2.4],
      [P.Wave, 1.6],
      [P.Jump, 1.2],
      [P.Idle, 1.6],
    ],
    { minFriendship: 70 },
  ),
  story(
    "bon-gift",
    ["bond"],
    7,
    [
      [P.Inspect, 2.4],
      [P.Walk, 2.6],
      [P.Wave, 1.8],
      [P.Celebrate, 2.2],
    ],
    { minFriendship: 65 },
  ),
  story(
    "bon-quiet-company",
    ["bond", "rest"],
    8,
    [
      [P.Walk, 2.4],
      [P.Sit, 4.4],
      [P.Idle, 2.4],
    ],
    { minFriendship: 50 },
  ),
  story(
    "bon-full-trust",
    ["bond"],
    6,
    [
      [P.Wave, 1.6],
      [P.Dance, 3],
      [P.Sit, 3],
      [P.Sleep, 3],
    ],
    { minFriendship: 90 },
  ),
];

const ROUTINE: readonly Story[] = [
  story("rou-morning-round", ["curiosity"], 8, [
    [P.Walk, 3],
    [P.Inspect, 2.2],
    [P.Walk, 2.6],
    [P.Observe, 2.4],
  ]),
  story("rou-patrol", ["observe"], 8, [
    [P.Walk, 3.2],
    [P.LookAround, 2.2],
    [P.Walk, 3],
    [P.Idle, 1.6],
  ]),
  story("rou-dust-corner", ["repair"], 7, [
    [P.Walk, 2.6],
    [P.Sit, 2.2],
    [P.Repair, 3],
    [P.Walk, 2.4],
  ]),
  story("rou-window-tour", ["observe"], 8, [
    [P.Walk, 2.6],
    [P.Observe, 2.6],
    [P.Walk, 2.6],
    [P.Observe, 2.4],
  ]),
  story("rou-think-walk", ["curiosity"], 7, [
    [P.Think, 2.4],
    [P.Walk, 3],
    [P.Think, 2.2],
    [P.Idle, 1.4],
  ]),
  story("rou-sit-watch-sit", ["rest"], 7, [
    [P.Sit, 2.6],
    [P.Observe, 2.6],
    [P.Sit, 2.6],
  ]),
  story("rou-return-home", ["rest"], 7, [
    [P.Walk, 3.4],
    [P.LookAround, 2],
    [P.Sit, 3],
  ]),
  story("rou-check-corners", ["observe"], 6, [
    [P.Walk, 2.6],
    [P.Peek, 2],
    [P.Walk, 2.6],
    [P.Peek, 2],
  ]),
  story("rou-pause-mid", ["rest"], 7, [
    [P.Walk, 2.4],
    [P.Idle, 2],
    [P.Walk, 2.6],
  ]),
  story("rou-stretch-break", ["rest"], 7, [
    [P.Walk, 2.6],
    [P.Wake, 1.8],
    [P.Walk, 2.4],
  ]),
  story("rou-second-look", ["curiosity"], 7, [
    [P.Walk, 2.4],
    [P.Idle, 1],
    [P.Walk, 1.6],
    [P.Inspect, 2.6],
  ]),
  story("rou-idle-drift", ["rest"], 6, [
    [P.Idle, 2.2],
    [P.Walk, 2.6],
    [P.Idle, 2.2],
  ]),
  story("rou-nod-along", ["play"], 6, [
    [P.Idle, 1.8],
    [P.Dance, 2.6],
    [P.Idle, 1.8],
  ]),
  story("rou-quick-fix", ["repair"], 7, [
    [P.Walk, 2.4],
    [P.Repair, 2.6],
    [P.Wave, 1.6],
  ]),
  story("rou-look-back", ["social"], 7, [
    [P.Walk, 2.6],
    [P.LookAround, 2],
    [P.Wave, 1.6],
    [P.Walk, 2.2],
  ]),
  story("rou-consider", ["curiosity"], 6, [
    [P.Inspect, 2.4],
    [P.Think, 2.6],
    [P.Walk, 2.4],
  ]),
  story("rou-tidy", ["repair"], 6, [
    [P.Sit, 2.2],
    [P.Repair, 2.6],
    [P.Idle, 1.6],
  ]),
  story("rou-daydream", ["rest"], 7, [
    [P.Sit, 3],
    [P.Observe, 3],
    [P.Think, 2.2],
  ]),
  story("rou-restless", ["mishap"], 6, [
    [P.Walk, 2.2],
    [P.Idle, 1.2],
    [P.Walk, 2.2],
    [P.Confused, 1.8],
  ]),
  story("rou-warm-up", ["play"], 6, [
    [P.Idle, 1.6],
    [P.Jump, 1.2],
    [P.Run, 2.4],
    [P.Idle, 1.6],
  ]),
  story("rou-window-hop", ["play"], 6, [
    [P.Walk, 2.4],
    [P.Jump, 1.2],
    [P.Observe, 2.4],
  ]),
  story("rou-slow-return", ["rest"], 6, [
    [P.Observe, 2.4],
    [P.Walk, 3],
    [P.Sit, 2.6],
  ]),
  story("rou-double-check", ["repair"], 6, [
    [P.Inspect, 2.2],
    [P.Repair, 2.4],
    [P.Inspect, 2.2],
  ]),
  story("rou-greet-desktop", ["social"], 6, [
    [P.LookAround, 2.2],
    [P.Wave, 1.6],
    [P.Walk, 2.6],
  ]),
  story("rou-settle-in", ["rest"], 6, [
    [P.Walk, 2.6],
    [P.Idle, 1.6],
    [P.Sit, 3.2],
  ]),
];

export const STORIES: readonly Story[] = [
  ...REPAIR,
  ...CURIOSITY,
  ...SOCIAL,
  ...REST,
  ...PLAY,
  ...MISHAP,
  ...OBSERVE,
  ...NIGHT,
  ...BOND,
  ...ROUTINE,
];
