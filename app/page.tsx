import { BootFlow } from "@/components/boot/BootFlow";
import { CrtOverlay } from "@/components/desktop/CrtOverlay";

export default function HomePage() {
  return (
    <main className="h-full bg-black">
      <BootFlow />
      <CrtOverlay />
    </main>
  );
}
