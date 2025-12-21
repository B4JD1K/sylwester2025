
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      return { user: "guest" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.user);
      console.log("file url", file.url);
      
      // We will likely save this to DB in the client or here. 
      // For simplicity in this app, we might just return the data to client 
      // or handling the DB insert in the client onSuccess (though server side is safer, client is easier for this quick app).
      // Given the requirement "photos... added to database", we should probably handle it.
      // But we need the 'uploader_name' from the client. Uploadthing middleware can pass input?
      // For now, let's keep it simple and just return the file info.
      return { uploadedBy: metadata.user, fileUrl: file.url, fileKey: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
