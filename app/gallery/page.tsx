
import { getPhotos } from "@/app/actions";
import GalleryClient from "@/components/gallery-client";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const photos = await getPhotos();
  return <GalleryClient initialPhotos={photos} />;
}
