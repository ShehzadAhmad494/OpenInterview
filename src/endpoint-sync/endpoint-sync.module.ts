import { Module } from '@nestjs/common';
import { EndpointScannerService } from './endpoint-sync.service';
import { EndpointSyncController } from './endpoint-sync.controller';

@Module({
  providers: [EndpointScannerService],
  controllers: [EndpointSyncController],
})
export class EndpointSyncModule {}
