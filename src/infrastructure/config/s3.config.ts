import { S3Client } from "@aws-sdk/client-s3";
import { validationError } from "@presentation/middlewares/error.middleware";
import { APPLICATION_MESSAGES } from "@shared/constants/index.constants";

interface S3Config {
  AWS_REGION: string;
  AWS_ACCESS_KEY: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_S3_BUCKET_NAME: string;
}

const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME } =
  process.env as unknown as S3Config;

if (!AWS_REGION || !AWS_ACCESS_KEY || !AWS_SECRET_ACCESS_KEY || !AWS_S3_BUCKET_NAME) {
  throw new validationError(APPLICATION_MESSAGES.MISSING_S3_CREDENTIALS);
}

export const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export const S3_BUCKET_NAME = AWS_S3_BUCKET_NAME;