export interface IParams {
    page?: number;
    size?: number;
    search?: string;
  }
  
  export interface IApiResponse<T> {
    data: T;
    message: string;
    meta?: {
      page: number;
      size: number;
      totalData: number;
      totalPages: number;
    };
  }
  
  export interface IMeta {
    page: number;
    size: number;
    totalData: number;
    totalPages: number;
  }
  