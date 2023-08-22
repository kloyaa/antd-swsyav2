export interface IApiResponse<T = any> {
  message: any;
  code: any;
  [key: string]: T;
}

export interface ISavedLogin {
  owner: string;
  token: string;
}
