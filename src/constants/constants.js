export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: 'Merchant registered successfully',
    LOGIN_SUCCESS: 'Logged in successfully',
    UNAUTHORIZED: 'Unauthorized access',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_TAKEN: 'Email is already in use',
    SLUG_TAKEN: 'Store slug is already in use',
  },
  PRODUCT: {
    CREATED: 'Product created successfully',
    UPDATED: 'Product updated successfully',
    DELETED: 'Product deleted successfully',
    NOT_FOUND: 'Product not found',
  },
  STORE: {
    NOT_FOUND: 'Store not found',
  },
};
