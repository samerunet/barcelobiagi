// FILE: app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

// TODO: Replace with real auth logic
async function getCurrentUser(_req: Request) {
  // Example future implementation:
  // const session = await auth();
  // return session?.user ?? null;

  return { id: "fake-admin-id", role: "ADMIN" as const };
}

const f = createUploadthing();

export const ourFileRouter = {
  productImageUploader: f(
    {
      image: {
        maxFileSize: "4MB",
        maxFileCount: 5,
      },
    },
    {
      awaitServerData: true,
    },
  )
    .input(
      z.object({
        productId: z.string().optional(),
      }),
    )
    .middleware(async ({ req, input }) => {
      const user = await getCurrentUser(req);

      if (!user || user.role !== "ADMIN") {
        throw new UploadThingError("Unauthorized");
      }

      return {
        userId: user.id,
        productId: input.productId ?? null,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.ufsUrl);
      console.log("File key:", file.key);
      console.log("Product ID:", metadata.productId);

      // In the future we may persist this with Prisma here.

      return {
        fileUrl: file.ufsUrl,
        fileKey: file.key,
        productId: metadata.productId,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
