export function errorHandler(error: unknown): Error {
  return error instanceof Error ? error : new Error('Unknown error');
}
