"use client";

import {useCallback, useEffect, useRef} from "react";
import Image from "next/image";
import {ChevronLeft, ChevronRight, X} from "lucide-react";
import {cn} from "@/lib/utils";
import {type photos} from "@/lib/schema";

type LightboxProps = {
  images: typeof photos.$inferSelect[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function Lightbox({images, currentIndex, onClose, onNavigate}: LightboxProps) {
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);
  const currentImage = images[currentIndex];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") onNavigate((currentIndex - 1 + images.length) % images.length);
    if (e.key === "ArrowRight") onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onClose, onNavigate]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    // Scroll active thumbnail into view
    if (thumbnailScrollRef.current) {
      const activeThumb = thumbnailScrollRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({behavior: 'smooth', inline: 'center', block: 'nearest'});
      }
    }
  }, [currentIndex]);

  if (!currentImage) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 z-50">
        <div className="text-white/80 text-sm">
          <span className="font-semibold text-white">{currentIndex + 1}</span> / {images.length}
          <span className="mx-2 opacity-50">|</span>
          Dodano przez: {currentImage.uploaderName || "Anonim"}
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X size={24}/>
        </button>
      </div>

      {/* Main Image Area */}
      <div className="relative flex-1 flex items-center justify-center p-4 min-h-0 overflow-hidden group">

        {/* Nav Buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((currentIndex - 1 + images.length) % images.length);
          }}
          className="absolute left-4 z-40 p-3 rounded-full bg-black/20 text-white/50 hover:bg-black/50 hover:text-white backdrop-blur-sm transition-all md:opacity-0 md:group-hover:opacity-100"
        >
          <ChevronLeft size={32}/>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((currentIndex + 1) % images.length);
          }}
          className="absolute right-4 z-40 p-3 rounded-full bg-black/20 text-white/50 hover:bg-black/50 hover:text-white backdrop-blur-sm transition-all md:opacity-0 md:group-hover:opacity-100"
        >
          <ChevronRight size={32}/>
        </button>

        <div className="relative w-full h-full flex items-center justify-center">
          {currentImage.mediaType === 'video' ? (
            <video
              src={currentImage.url}
              controls
              autoPlay
              className="max-w-full max-h-full object-contain focus:outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <Image
              src={currentImage.url}
              alt={`Photo by ${currentImage.uploaderName}`}
              fill
              className="object-contain"
              priority
              unoptimized
            />
          )}
        </div>
      </div>

      {/* Thumbnails Strip */}
      <div className="h-24 bg-black/40 backdrop-blur-md border-t border-white/10 flex items-center px-4 shrink-0 z-50">
        <div
          ref={thumbnailScrollRef}
          className="flex gap-2 overflow-x-auto w-full no-scrollbar justify-center items-center py-2"
        >
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => onNavigate(idx)}
              className={cn(
                "relative h-16 w-16 shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200",
                currentIndex === idx ? "border-primary opacity-100 scale-105" : "border-transparent opacity-50 hover:opacity-80"
              )}
            >
              {img.mediaType === 'video' && !img.thumbnailUrl ? (
                <video
                  src={img.url}
                  className="object-cover w-full h-full opacity-80"
                  muted
                  preload="metadata"
                />
              ) : (
                <Image
                  src={img.mediaType === 'video' && img.thumbnailUrl ? img.thumbnailUrl : (img.mediaType === 'video' ? img.url.replace(/\.[^/.]+$/, ".jpg") : img.url)}
                  alt="thumbnail"
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
