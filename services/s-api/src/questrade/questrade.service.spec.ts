import { Test, TestingModule } from '@nestjs/testing';
import { QuestradeService } from './questrade.service';

describe('QuestradeService', () => {
  let service: QuestradeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestradeService],
    }).compile();

    service = module.get<QuestradeService>(QuestradeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
