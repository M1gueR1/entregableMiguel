import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(({ file }) => {
    return { url: file.ufsUrl };
  }),

  videoUploader: f({
    video: { maxFileSize: "64MB", maxFileCount: 1 },
  }).onUploadComplete(({ file }) => {
    return { url: file.ufsUrl };
  }),
};

export type OurFileRouter = typeof ourFileRouter;
