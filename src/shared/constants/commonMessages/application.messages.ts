export const APPLICATION_MESSAGES = {
  INTERNAL_SERVER_ERROR:
    'An internal server error occurred. Please try again later.',
  LIMIT_EXCEEDED:
    'Too many requests. Please try again later.',
  NOT_FOUND:
    'The resource was not found.',
  FAILED_TO_UPLOAD_TO_CLOUDINARY:
    'Failed to upload data to Cloudinary.',
  MISSING_EMAIL_ENVIRONMENT_VARIABLES:
    'Missing required email environment variables.',
  MISSING_CLOUDINARY_CREDENTIALS:
    'Missing required Cloudinary environment variables.',
  MISSING_JWT_ENVIRONMENT_VARIABLES:
    'Missing required JWT environment variables.',
  ALL_FIELDS_ARE_REQUIRED:
    'Please ensure that all required fields are available.',
    NO_FIELDS_TO_UPDATE: "No fields to update",
    MISSING_S3_CREDENTIALS: "Missing required AWS S3 environment variables",
FAILED_TO_UPLOAD_TO_S3: "Failed to upload image to S3",
INVALID_IMAGE_FORMAT: "Invalid image format. Expected base64 data URI",
} as const

