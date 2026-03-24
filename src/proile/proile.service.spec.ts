import { Test, TestingModule } from '@nestjs/testing';
import { ProileService } from './proile.service';

describe('ProileService', () => {
  let service: ProileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProileService],
    }).compile();

    service = module.get<ProileService>(ProileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
