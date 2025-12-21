"use client";

import { useState } from "react";
import Masonry from "react-masonry-css";
import { UploadButton } from "@/lib/uploadthing";
import { type photos } from "@/lib/schema";
import { useUser } from "@/lib/user-context";
import { addPhoto } from "@/app/actions"; // Server action to save to DB
import { toast } from "sonner";
import Image from "next/image";
import { Lightbox } from "@/components/lightbox";

export default function GalleryClient({ initialPhotos }: { initialPhotos: typeof photos.$inferSelect[] }) {
  const { name } = useUser();
  const [photosList, setPhotosList] = useState(initialPhotos);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold mb-2">Galeria Wspomnień</h1>
           <p className="text-muted-foreground">Wrzuć fotki, nie mogą być usuwane! :)</p>
        </div>
        <div className="flex-shrink-0">
            <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={async (res) => {
                  // Save to DB
                  if (res && res.length > 0) {
                     // We handle each file
                     // Note: We need to trigger the DB save. 
                     // Ideally we do this via server action for security/consistency, 
                     // but we need to pass the file key/url which we got from UT.
                     // The server-side onUploadComplete in core.ts is safer but passing 'name' there is tricky without custom headers or metadata.
                     // Client side trigger is acceptable for this app scope.
                     
                     for (const file of res) {
                        await addPhoto(file.url, file.key, name || "Anonim");
                     }
                     
                     toast.success("Zdjęcia dodane!");
                     // Refresh needed? We could append locally or refresh page.
                     // Let's refresh page properly or router.refresh()
                     window.location.reload(); 
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error(`Błąd: ${error.message}`);
                }}
                appearance={{
                    button: "bg-primary text-primary-foreground hover:bg-primary/90 ut-uploading:cursor-not-allowed",
                    allowedContent: "text-muted-foreground"
                }}
            />
        </div>
      </div>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 bg-clip-padding"
      >
        {photosList.map((photo, index) => (
            <div 
                key={photo.id} 
                className="mb-4 break-inside-avoid overflow-hidden rounded-lg shadow-sm border bg-card cursor-pointer group"
                onClick={() => setLightboxIndex(index)}
            >
                <div className="relative">
                    <Image 
                        src={photo.url} 
                        alt={`Uploaded by ${photo.uploaderName}`}
                        width={500}
                        height={500}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="p-2 text-xs text-muted-foreground flex justify-between">
                    <span>by <span className="font-medium text-foreground">{photo.uploaderName}</span></span>
                    <span>{new Date(photo.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
            </div>
        ))}
      </Masonry>
      
      {photosList.length === 0 && (
          <div className="text-center py-20 text-muted-foreground border-dashed border-2 rounded-xl">
              Jeszcze pusto. Bądź pierwszy!
          </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox 
            images={photosList}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
