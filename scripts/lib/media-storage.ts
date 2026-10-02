import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "node:fs";
import { createAdminClient } from "../supabase-admin";

const cacheControl = "public, max-age=31536000, immutable";

export async function uploadMedia(key: string, file: string, contentType: string): Promise<string> {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");

  if (endpoint && accessKeyId && secretAccessKey && bucket && publicUrl) {
    const client = new S3Client({
      region: "auto",
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });
    try {
      await new Upload({
        client,
        params: {
          Bucket: bucket,
          Key: key,
          Body: fs.createReadStream(file),
          ContentType: contentType,
          CacheControl: cacheControl,
        },
        leavePartsOnError: false,
      }).done();
    } finally {
      client.destroy();
    }
    return `${publicUrl}/${key}`;
  }

  const [bucketName, ...pathParts] = key.split("/");
  const objectPath = pathParts.join("/");
  if (!bucketName || !objectPath) {
    throw new Error(`Media key must include a bucket and object path: ${key}`);
  }

  const admin = createAdminClient();
  const { error } = await admin.storage.from(bucketName).upload(objectPath, fs.createReadStream(file), {
    upsert: true,
    contentType,
    cacheControl: "31536000",
    headers: { "cache-control": cacheControl },
  });
  if (error) throw error;
  return admin.storage.from(bucketName).getPublicUrl(objectPath).data.publicUrl;
}
