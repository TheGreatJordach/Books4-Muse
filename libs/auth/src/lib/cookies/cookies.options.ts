export interface CookieOptions {
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: sameSiteOption;
}

export type sameSiteOption = 'strict' | 'lax' | 'none'
