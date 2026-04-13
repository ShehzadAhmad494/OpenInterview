import { Test, TestingModule } from '@nestjs/testing';
import { EndpointSyncService } from './endpoint-sync.service';

describe('EndpointSyncService', () => {
  let service: EndpointSyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EndpointSyncService],
    }).compile();

    service = module.get<EndpointSyncService>(EndpointSyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
