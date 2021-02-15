import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { WelcomeResponse } from './interface/app.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): WelcomeResponse {
    return this.appService.getHello();
  }
}
