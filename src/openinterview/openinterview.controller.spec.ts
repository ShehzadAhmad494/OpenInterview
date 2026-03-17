import { Test, TestingModule } from '@nestjs/testing';
import { OpeninterviewController } from './openinterview.controller';

describe('OpeninterviewController', () => {
  let controller: OpeninterviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpeninterviewController],
    }).compile();

    controller = module.get<OpeninterviewController>(OpeninterviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
