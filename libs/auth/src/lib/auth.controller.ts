import { Body, Controller, HttpCode, Post, Req, Res, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto, MiniUserDto } from '@books4-muse/models';
import {Response, Request} from 'express';
import { CookieService } from './cookies/cookie.service';
import * as process from 'node:process';

@Controller()
export class AuthController {
  constructor(private authService: AuthService,
              private readonly cookiesService: CookieService,) {}

  @Version('1')
  @Post("admin/signup")
  async registration(
    @Res({passthrough:true}) response: Response,
    @Body() createUserDto: CreateUserDto
  )  {
    const accessToken = await this.authService.signUP(createUserDto);

   this.cookiesService.setCookie(response,"jwtToken",accessToken, {
     maxAge: 30 * 60 * 1000, // 30 minutes,
     httpOnly: true,
     secure: process.env["NODE_ENV"] === "production", // Use secure cookies only in production
     sameSite: 'strict',
   })

    // Send the response back to the client
    response.json({ message: 'Login successful' });
  }

  @HttpCode(200)
  @Version('1')
  @Post("admin/login")
  async login(
    @Body() loginDto: LoginDto,
    @Req() reqquest: Request,
    @Res() response:Response) {

    const [publicUser ,accessToken] : [MiniUserDto, string] = await this.authService.signIn(loginDto);

    // Set the cookie first
    this.cookiesService.setCookie(response,"jwtToken",accessToken, {
      maxAge: 2 * 86400000, // 172,800,000 milliseconds. or 2days,
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production", // Use secure cookies only in production
      sameSite: 'strict',
    })

    // Send a response indicating successful login
    response.status(200).json({
      message: 'Login successful',
      user: publicUser, // Optionally include non-sensitive user info
    });
  }


  // TODO protect the route
  @HttpCode(200)
  @Version("1")
  @Post("admin/logout")
  async logout(
    @Req() request: Request,
    @Res() response:Response,
    ) {
    console.log(request.cookies);
    // Clear the auth cookie on logout
    this.cookiesService.clearCookie(response,"jwtToken");
    // Send the response back to the client
    response.status(200).json({ message: 'Logged out successfully' })
  }
}
