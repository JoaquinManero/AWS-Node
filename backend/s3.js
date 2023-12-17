import {
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: "AKIAT6GAUQSBCAVKOQIR",
    secretAccessKey: "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",
  },
});

export async function uploadFile(file) {
  const stream = fs.createReadStream(file.tempFilePath);
  const uploadParams = {
    Bucket: "myangularawsbuckets3",
    Key: file.name,
    Body: stream,
  };
  const command = new PutObjectCommand(uploadParams);
  await client.send(command);
}

export async function getFiles() {
  const data = await client.send(
    new ListObjectsCommand({
      Bucket: "myangularawsbuckets3",
    })
  );
  return data.Contents;
}

export async function getFileURL(filename) {
  const command = new GetObjectCommand({
    Bucket: "myangularawsbuckets3",
    Key: filename,
  });
  return await getSignedUrl(client, command, { expiresIn: 3600 });
}

export async function downloadFile(filename) {
  const command = new GetObjectCommand({
    Bucket: "myangularawsbuckets3",
    Key: filename,
  });
  const data = await client.send(command);
  data.Body.pipe(fs.createWriteStream(`./downloads/${filename}`));
}
