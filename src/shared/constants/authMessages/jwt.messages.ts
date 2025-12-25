export const JWT_MESSAGES = {
  AUTH_HEADER_MISSING:
    'The authentication header is missing. Please include the Authorization header with a valid token.',
  NO_REFRESH_TOKEN:
    'Refresh token is missing. Please ensure you provide a valid refresh token.',
  NO_ACCESS_TOKEN:
    'No access token provided. Please include a valid access token in your request.',
  INVALID_REFRESH_TOKEN:
    'The provided refresh token is invalid. Please login again or provide a valid token.',
  INVALID_ACCESS_TOKEN:
    'The access token is invalid. Please authenticate again to obtain a valid token.',
  TOKEN_REFRESH_SUCCESS:
    'Access token has been successfully refreshed. You can now proceed with the updated token.',
} as const
