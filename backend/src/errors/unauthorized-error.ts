class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string = 'Нет доступа') {
    super(message);
    this.statusCode = 401;
  }
}

export default UnauthorizedError;
