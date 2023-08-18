export interface IApiResponse<T = any> {
  message: any;
  code: any;
  [key: string]: T;
}
