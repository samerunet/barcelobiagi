"use client";

import { useState } from "react";
import type { ClientUploadedFileData } from "uploadthing/types";
import { UploadButton } from "@/utils/uploadthing";

type UploadedImage = {
  fileUrl: string;
  fileKey: string;
  productId?: string | null;
};

interface ProductImageUploaderProps {
  productId?: string;
  onImagesChange?: (images: UploadedImage[]) => void;
}

export function ProductImageUploader({
  productId,
  onImagesChange,
}: ProductImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const handleComplete = (
    res: ClientUploadedFileData<{
      fileUrl: string;
      fileKey: string;
      productId: string | null;
    }>[],
  ) => {
    const normalized = res.map((file) => ({
      fileUrl: file.serverData?.fileUrl ?? file.url,
      fileKey: file.serverData?.fileKey ?? file.key,
      productId: file.serverData?.productId ?? productId ?? null,
    }));

    setImages(normalized);
    onImagesChange?.(normalized);
  };

  return (
    <div className="space-y-3">
      <UploadButton
        endpoint="productImageUploader"
        // @ts-expect-error UploadThing helpers currently omit the `input` prop in their typings
        input={{ productId }}
        onClientUploadComplete={handleComplete}
        onUploadError={(error: Error) => {
          console.error(error);
          alert(`Upload error: ${error.message}`);
        }}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {images.map((img) => (
            <div key={img.fileKey} className="relative aspect-square">
              <img
                src={img.fileUrl}
                alt="Uploaded product image"
                className="h-full w-full object-cover rounded-md border"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
