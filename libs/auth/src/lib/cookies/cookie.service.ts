import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import {Response} from 'express';
import { CookieOptions, sameSiteOption } from './cookies.options';



@Injectable()
export class CookieService {
  private readonly isProduction = process.env["NODE_ENV"] === "production";


  /**
   * Sets a cookie in the response.
   * @param res - The Express response object.
   * @param name - The name of the cookie.
   * @param value - The value of the cookie.
   * @param options - Additional cookie options.
   */
   setCookie(
     res:Response,
     name: string,
     value: string,
     options?: CookieOptions
  ): void {
    const defaultOptions = {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'strict' as sameSiteOption,  // Default value,
      maxAge: 7 * 24 * 60 * 60 * 1000, // Default: 7 days
      ...options,
    };

    res.cookie(name, value, defaultOptions);
   }


  /**
   * Clears a cookie from the response.
   * @param res - The Express response object.
   * @param name - The name of the cookie.
   */
  clearCookie(res: Response, name:string): void {
    res.clearCookie(name,{
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'strict' as sameSiteOption,
    });
  }

}
