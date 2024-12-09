import { DynamicModule, Module } from '@nestjs/common';
import { MongooseService } from './mongoose.service';

@Module({
  providers: [MongooseService]
})
export class MongooseModule {
  static register(options): DynamicModule {
    return {
      module: MongooseService,
      providers: [
        {
          provide: 'MONGOOSE_OPTIONS',
          useValue: options
        },
        MongooseService],
      exports: [MongooseService]
    }
  }
}
