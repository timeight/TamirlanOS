import { SystemPhase } from "@/types/system";

const allowed: Readonly<Record<SystemPhase, readonly SystemPhase[]>> = {
  [SystemPhase.Off]: [SystemPhase.Booting],
  [SystemPhase.Booting]: [SystemPhase.Login],
  [SystemPhase.Login]: [SystemPhase.Desktop, SystemPhase.ShuttingDown],
  [SystemPhase.Desktop]: [SystemPhase.ShuttingDown, SystemPhase.Login],
  [SystemPhase.ShuttingDown]: [SystemPhase.Off],
};

export function canTransition(from: SystemPhase, to: SystemPhase): boolean {
  return allowed[from].includes(to);
}
