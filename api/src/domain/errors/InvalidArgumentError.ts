import httpStatus from 'http-status';

export default class InvalidArgumentError extends Error {
  readonly message: string;
  readonly httpStatus: number;

  constructor(message: string) {
    super();
    this.message = message;
    this.httpStatus = httpStatus.BAD_REQUEST;
  }
}
