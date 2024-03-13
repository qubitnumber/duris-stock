import { Test, TestingModule } from '@nestjs/testing';
import { QuestradeController } from './questrade.controller';

describe('QuestradeController', () => {
  let controller: QuestradeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestradeController],
    }).compile();

    controller = module.get<QuestradeController>(QuestradeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
