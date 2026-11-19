import { Dashboard } from "@/components/dashboard";
import { getDashboardData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getDashboardData();
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date()).toUpperCase();
  return <Dashboard initialData={data} dateLabel={dateLabel} />;
}
