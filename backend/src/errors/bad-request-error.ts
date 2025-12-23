class BadRequestError extends Error {
  public statusCode: number;

  constructor(message: string = 'Некорректные данные') {
    super(message);
    this.statusCode = 400;
  }
}

export default BadRequestError;
