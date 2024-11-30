import { Body, Controller, Post, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, EUser } from '@books4-muse/models';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Version('1')
  @Post("admin/signup")
  async registration(@Body() createUserDto: CreateUserDto)  {
    //return await this.authService.signUP(createUserDto);
    return `This handler create new User with ${JSON.stringify(createUserDto)}`;
  }
}
