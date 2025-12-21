
import { getContributions } from "@/app/actions";
import HomeClient from "@/components/home-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getContributions();
  return (
    // <div className="mx-auto bg-card/40 backdrop-blur-sm border rounded-xl p-4 md:p-8 shadow-sm">
      <HomeClient initialData={data} />
    // </div>
  );
}
