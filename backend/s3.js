import {
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import {
  AWS_BUCKET_REGION,
  AWS_BUCKET_NAME,
  AWS_PUBLIC_KEY,
  AWS_SECRET_KEY,
} from "./config.js";

const client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_PUBLIC_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

export async function uploadFile(file) {
  const stream = fs.createReadStream(file.tempFilePath);
  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: file.name,
    Body: stream,
  };
  const command = new PutObjectCommand(uploadParams);
  await client.send(command);
}

export async function getFiles() {
  const data = await client.send(
    new ListObjectsCommand({
      Bucket: AWS_BUCKET_NAME,
    })
  );
  return data.Contents;
}

export async function getFileURL(filename) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: filename,
  });
  return await getSignedUrl(client, command, { expiresIn: 3600 });
}

export async function downloadFile(filename) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: filename,
  });
  const data = await client.send(command);
  data.Body.pipe(fs.createWriteStream(`./downloads/${filename}`));
}
