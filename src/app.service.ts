import { Injectable } from '@nestjs/common';
import { WelcomeResponse } from './interface/app.interface';

@Injectable()
export class AppService {
  getHello(): WelcomeResponse {
    return { message: 'Welcome to nestjs tdd-products-api' };
  }
}
