// FILE: app/api/uploadthing/route.ts
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Export both GET and POST handlers for UploadThing
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // Optional: add config here if needed
});
