"use client";

import { useState } from "react";
import Masonry from "react-masonry-css";
import { UploadButton } from "@/lib/uploadthing";
import { type photos } from "@/lib/schema";
import { useUser } from "@/lib/user-context";
import { addPhoto, deletePhoto } from "@/app/actions";
import { toast } from "sonner";
import Image from "next/image";
import { Lightbox } from "@/components/lightbox";
import { CldUploadButton } from 'next-cloudinary';
import { Trash2, Play, Video, Camera } from "lucide-react";

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
        <div className="flex flex-row w-full justify-center items-start gap-4">
          <div className="flex-shrink-0">
              <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={async (res) => {
                    if (res && res.length > 0) {
                      for (const file of res) {
                          // Check if file is video based on name or type if available
                          // UploadThing client types usually include basic info
                          const isVideo = file.name.match(/\.(mp4|webm|ogg|mov)$/i);
                          await addPhoto(file.url, file.key, name || "Anonim", !!isVideo ? "video" : "image");
                      }
                      toast.success("Media dodane!");
                      window.location.reload(); 
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Błąd: ${error.message}`);
                  }}
                  appearance={{
                      button: "h-10 px-24 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium whitespace-nowrap ut-uploading:cursor-not-allowed",
                      allowedContent: "hidden"
                  }}
                  content={{
                      button: (
                        <span className="flex items-center gap-2">
                          <Camera size={16} />
                          Dodaj zdjęcia / wideo
                        </span>
                      ),
                  }}
              />
          </div>
          <div className="flex-shrink-0">
                  <CldUploadButton
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                      options={{ sources: ['local', 'url'], resourceType: 'auto', cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dc0abdx6j" }}
                      onSuccess={async (result: any) => {
                          if (result.info) {
                              const isVideo = result.info.resource_type === 'video';
                              await addPhoto(
                                  result.info.secure_url, 
                                  result.info.public_id, 
                                  name || "Anonim", 
                                  isVideo ? "video" : "image", 
                                  result.info.thumbnail_url
                              );
                              toast.success("Media dodane!");
                              window.location.reload();
                          }
                      }}
                      className="h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md text-sm font-medium whitespace-nowrap transition-colors flex items-center justify-center gap-2"
                  >
                      <Video size={16} /> Dodaj Wideo / Zdjęcia
                  </CldUploadButton>
          </div>
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
                    {photo.mediaType === 'video' ? (
                        <div className="relative aspect-square bg-black">
                            {photo.thumbnailUrl ? (
                                <Image 
                                    src={photo.thumbnailUrl} 
                                    alt={`Uploaded by ${photo.uploaderName}`}
                                    width={500}
                                    height={500}
                                    className="w-full h-auto object-cover opacity-80"
                                    unoptimized
                                />
                            ) : (
                                <video
                                    src={`${photo.url}#t=0.1`}
                                    className="w-full h-full object-cover opacity-80"
                                    muted
                                    playsInline
                                    preload="metadata"
                                />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <Play className="w-12 h-12 text-white/90 drop-shadow-lg" fill="currentColor" />
                            </div>
                        </div>
                    ) : (
                        <Image 
                            src={photo.url} 
                            alt={`Uploaded by ${photo.uploaderName}`}
                            width={500}
                            height={500}
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                        />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                    
                    {/* Delete Button */}
                    {name === photo.uploaderName && (Date.now() - new Date(photo.createdAt).getTime() < 15 * 60 * 1000) && (
                        <button 
                            onClick={async (e) => {
                                e.stopPropagation();
                                if(confirm("Usunąć to wspomnienie?")) {
                                    const res = await deletePhoto(photo.id, name || "");
                                    if(res.success) {
                                        toast.success("Usunięto!");
                                        setPhotosList(prev => prev.filter(p => p.id !== photo.id));
                                    } else {
                                        toast.error(res.error || "Błąd usuwania");
                                    }
                                }
                            }}
                            className="absolute top-2 right-2 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
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
