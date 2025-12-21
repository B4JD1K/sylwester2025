
import { getContributions } from "@/app/actions";
import HomeClient from "@/components/home-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getContributions();
  return <HomeClient initialData={data} />;
}
