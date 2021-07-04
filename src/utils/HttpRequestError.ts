class HttpRequestError extends Error {
  public message: string;

  public code: number;

  constructor(message: string, code: number) {
    super();

    this.message = message;
    this.code = code;
  }
}

export default HttpRequestError;
