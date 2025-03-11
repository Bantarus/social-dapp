export type ErrorType = 
  | 'wallet_error'
  | 'contract_error'
  | 'network_error'
  | 'validation_error'
  | 'unknown_error';

export interface AppError extends Error {
  type: ErrorType;
  originalError?: unknown;
  data?: Record<string, unknown>;
  userMessage?: string;
}

export function createAppError(
  message: string, 
  type: ErrorType = 'unknown_error',
  originalError?: unknown,
  data?: Record<string, unknown>
): AppError {
  const error = new Error(message) as AppError;
  error.name = 'AppError';
  error.type = type;
  
  if (originalError) {
    error.originalError = originalError;
  }
  
  if (data) {
    error.data = data;
  }
  
  // Create a friendly user message based on error type
  switch (type) {
    case 'wallet_error':
      error.userMessage = 'Wallet operation failed. Please check your connection and try again.';
      break;
    case 'contract_error':
      error.userMessage = 'Smart contract operation failed. The transaction could not be completed.';
      break;
    case 'network_error':
      error.userMessage = 'Network connection issue. Please check your internet connection.';
      break;
    case 'validation_error':
      error.userMessage = 'Invalid input. Please check the provided information.';
      break;
    default:
      error.userMessage = 'An unexpected error occurred. Please try again later.';
  }
  
  return error;
}

export function isAppError(error: unknown): error is AppError {
  return (
    error instanceof Error && 
    'type' in error && 
    'userMessage' in error
  );
}

export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.userMessage || error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return String(error);
}