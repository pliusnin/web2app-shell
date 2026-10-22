export type FetchInterceptor = {
  // A returned request replaces the one sent; nothing returned keeps it
  onRequest?: (request: Request) => Request | void | Promise<Request | void>;
  // Gets a clone, reading its body doesn't consume the page's response. A
  // returned response replaces the one sent to the page
  onResponse?: (
    response: Response,
    request: Request,
  ) => Response | void | Promise<Response | void>;
};
