// ─── Application error hierarchy ─────────────────────────────────────────────
//
// All runtime errors extend AppError so catch blocks can use a single
// instanceof check when they only need to distinguish "our" errors from
// truly unexpected ones.
//
// Usage:
//   throw new NotFoundError('Asset not found')
//   throw new ValidationError('Invalid input', { email: ['Email is required'] })
//   throw new PermissionError()

// ─── Base ─────────────────────────────────────────────────────────────────────

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// ─── Network ──────────────────────────────────────────────────────────────────

/** Thrown when the request never reached the server (offline, CORS, timeout). */
export class NetworkError extends AppError {
  constructor(message = 'Network error — please check your connection') {
    super(message, 'NETWORK_ERROR')
    this.name = 'NetworkError'
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

/** Thrown when the session is invalid or has expired after refresh fails. */
export class AuthError extends AppError {
  constructor(message = 'Your session has expired — please log in again') {
    super(message, 'AUTH_ERROR')
    this.name = 'AuthError'
  }
}

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Thrown on HTTP 422.
 * `fields` mirrors the server's field-level error map so form libraries
 * (react-hook-form, etc.) can set errors directly.
 *
 * @example
 * throw new ValidationError('Validation failed', {
 *   email: ['Email is already taken'],
 *   role:  ['Role is required'],
 * })
 */
export class ValidationError extends AppError {
  constructor(
    message = 'Validation failed',
    public readonly fields: Record<string, string[]> = {},
  ) {
    super(message, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

// ─── Not found ────────────────────────────────────────────────────────────────

/** Thrown on HTTP 404. */
export class NotFoundError extends AppError {
  constructor(message = 'The requested resource was not found') {
    super(message, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

// ─── Permission ───────────────────────────────────────────────────────────────

/** Thrown on HTTP 403. */
export class PermissionError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, 'PERMISSION_DENIED')
    this.name = 'PermissionError'
  }
}
