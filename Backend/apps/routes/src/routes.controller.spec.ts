import { Test, TestingModule } from '@nestjs/testing';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';

describe('RoutesController', () => {
  let routesController: RoutesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RoutesController],
      providers: [RoutesService],
    }).compile();

    routesController = app.get<RoutesController>(RoutesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(routesController.getHello()).toBe('Hello World!');
    });
  });
});
