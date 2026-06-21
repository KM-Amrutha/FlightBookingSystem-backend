import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_BUCKET_NAME } from "@infrastructure/config/s3.config";
import { ICloudStorageService } from "@di/file-imports-index";
import { UploadImage } from "@application/dtos/service/cloud.storage.service";
import { validationError } from "@presentation/middlewares/error.middleware";
import { APPLICATION_MESSAGES } from "@shared/constants/index.constants";
import { injectable } from "inversify";
import { randomUUID } from "crypto";

@injectable()
export class S3StorageService implements ICloudStorageService {
  async uploadImage(uploadImage: UploadImage): Promise<string> {
    const { image, folder } = uploadImage;

    // ── decode base64 data URI ────────────────────────────────────────────
    const matches = image.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new validationError(APPLICATION_MESSAGES.INVALID_IMAGE_FORMAT);
    }

    const mimeType = matches[1] as string;
    const base64Data = matches[2] as string;
    const buffer = Buffer.from(base64Data, "base64");

    // ── derive extension from mime type ───────────────────────────────────
    const extensionMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "application/pdf": "pdf",
    };

    const extension = extensionMap[mimeType] ?? "bin";
    const fileName = `${folder}/${randomUUID()}.${extension}`;

    // ── upload to S3 ──────────────────────────────────────────────────────
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: fileName,
          Body: buffer,
          ContentType: mimeType,
        })
      );

      // ── return public URL ─────────────────────────────────────────────
      // return `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
      return `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown S3 upload error";
      console.error("S3 upload error:", message);
      throw new validationError(APPLICATION_MESSAGES.FAILED_TO_UPLOAD_TO_S3);
    }
  }
}