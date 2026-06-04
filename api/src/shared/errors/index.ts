import httpStatus from "http-status";

// Shared error class for domain errors
export class DomainError extends Error {
  readonly statusCode: number;
  readonly status: string;
  readonly name: string;


  constructor(
    message: string,
    statusCode: number,
    status: string,
    name: string = 'DomainError'
  ) {
    super(message);
    this.name = name;
    this.status = status;
    this.statusCode = statusCode;
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, httpStatus.BAD_REQUEST, httpStatus[400], 'ValidationError');
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message, httpStatus.NOT_FOUND, httpStatus[404], 'NotFoundError');
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, httpStatus.CONFLICT, httpStatus[409], 'ConflictError');
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Unauthorized') {
    super(message, httpStatus.UNAUTHORIZED, httpStatus[401], 'UnauthorizedError');
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string = 'Forbidden') {
    super(message, httpStatus.FORBIDDEN, httpStatus[403], 'ForbiddenError');
  }
}

export class InternalServerError extends DomainError {
  constructor(message: string = 'Internal server error') {
    super(message, httpStatus.INTERNAL_SERVER_ERROR, httpStatus[500], 'InternalServerError');
  }
}
