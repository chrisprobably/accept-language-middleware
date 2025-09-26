import { RequestHandler } from "express";

declare namespace AcceptLanguageMiddleware {
  interface Options {
    default?: string;
    supported?: string[];
  }

  interface AugmentedRequest {
    language?: string;
    locale?: string;
  }
}

declare module "express-serve-static-core" {
  interface Request {
    language?: string;
    locale?: string;
  }
}

declare function acceptLanguageMiddleware(
  options?: AcceptLanguageMiddleware.Options
): RequestHandler;

export = acceptLanguageMiddleware;
