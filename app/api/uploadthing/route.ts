import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

console.log("UT Token check:", process.env.UPLOADTHING_TOKEN ? "Present" : "Missing");

// Export routes for Next.js App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
