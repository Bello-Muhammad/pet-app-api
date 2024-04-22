export class ApiResponseHandler {
  static successResponse(code: number, message: string, data: any): any {
    return {
      StatusCode: code,
      responseMessage: message,
      data
    };
  }

  static failedResponse(code: number, message: string, error: string): any {
    return {
      StatusCode: code,
      responseMessage: message,
      error
    };
  }
}
