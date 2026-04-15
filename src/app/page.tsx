import { AppShell } from "@/components/layout/AppShell";
import { HomeScreen } from "@/features/home/components/HomeScreen";

export default function HomePage() {
  return (
    <AppShell>
      <HomeScreen />
    </AppShell>
  );
}
