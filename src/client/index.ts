import got, {
  Method,
  OptionsOfJSONResponseBody,
} from 'got';

export type RequestParams<T> = {
  method: string;
  path: string;
  data?: T;
};

export type ClientOptions = {
  url: string;
  token: string;
};

export class Client {
  private url: string;
  private token: string;
  
  constructor(options: ClientOptions) {
    const {
      url,
      token,
    } = options;
    
    this.url = url;
    this.token = token;
  }
  
  public async request<Q, S>(params: RequestParams<Q>): Promise<S> {
    try {
      const gotOptions: OptionsOfJSONResponseBody = {
        method: params.method as Method,
        headers: {
          'authorization': `Bearer ${this.token}`,
        },
        json: params.data as Record<string, any> | undefined,
        responseType: 'json',
        timeout: 20000,
        retry: 0,
        followRedirect: false,
        throwHttpErrors: false,
      };
      
      const res = await got<S>(this.url + params.path, gotOptions);
      
      if (res.statusCode < 200 || res.statusCode >= 300) {
        const message = res.statusMessage ?? 'request failed';
        const status = res.statusCode;
        const body = res.body as object | undefined;
        
        throw new HTTPError(message, status, body);
      }
      
      return res.body;
    } catch (err) {
      throw new ClientError('request failed', {
        cause: err,
        details: {
          method: params.method,
          path: params.path,
        },
      });
    }
  }
}

export type ClientErrorOptions = ErrorOptions & {
  details?: object;
};

export class ClientError extends Error {
  public details?: object;
  
  constructor(message?: string, options?: ClientErrorOptions) {
    super(message, options);
    
    this.details = options?.details;
  }
}

export class HTTPError extends Error {
  public status: number;
  public body?: object;
  
  constructor(message: string, status: number, body?: object) {
    super(message);
    
    this.status = status;
    this.body = body;
  }
}
