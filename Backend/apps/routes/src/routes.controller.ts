import { Controller, Get } from '@nestjs/common';
import { RoutesService } from './routes.service';

@Controller()
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  getHello(): string {
    return this.routesService.getHello();
  }
}
