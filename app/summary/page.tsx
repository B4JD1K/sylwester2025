
import { getContributions } from "@/app/actions";
import SummaryClient from "@/components/summary-client";

export const dynamic = "force-dynamic";

export default async function SummaryPage() {
  const data = await getContributions();
  return <SummaryClient data={data} />;
}
