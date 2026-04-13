import { Test, TestingModule } from '@nestjs/testing';
import { EndpointSyncController } from './endpoint-sync.controller';

describe('EndpointSyncController', () => {
  let controller: EndpointSyncController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EndpointSyncController],
    }).compile();

    controller = module.get<EndpointSyncController>(EndpointSyncController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
