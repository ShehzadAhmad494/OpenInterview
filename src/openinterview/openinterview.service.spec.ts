import { Test, TestingModule } from '@nestjs/testing';
import { OpeninterviewService } from './openinterview.service';

describe('OpeninterviewService', () => {
  let service: OpeninterviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpeninterviewService],
    }).compile();

    service = module.get<OpeninterviewService>(OpeninterviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
